import { Close } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useCriterias, usePitches, useTeams } from "../../../hooks";
import { MeetingsService } from "../../../services";

const SlideTransition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function CreateMeetingDialog({ open, handleClose }) {
  const { user, classId, classRoom, classMember } = useOutletContext();

  const { isLoading: loadingPitches, pitches } = usePitches();
  const { isLoading: loadingCriterias, criterias } = useCriterias();
  const { isRetrieving: loadingTeams, teams } = useTeams(classId);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacher_weight_score: "80",
    student_weight_score: "20",
  });
  const [checkedTeams, setCheckedTeams] = useState([]);
  const [formCriterias, setFormCriterias] = useState([]);

  useEffect(() => {
    console.log("Criterias:", criterias); // Debug statement
    console.log("Teams:", teams); // Debug statement

    if (criterias && criterias.length > 0) {
      setFormCriterias(criterias.map(() => ({ criteria: false, weight: "0" })));
    }
    if (teams && teams.length > 0) {
      setCheckedTeams(teams.map(() => false));
    }
  }, [criterias, teams]);

  const [isWeightError, setIsWeightError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { name, description, teacher_weight_score, student_weight_score } =
    formData;

  const handleInputChange = (e) => {
    let { name: fieldName, value } = e.target;

    if (fieldName === "teacher_weight_score") {
      if (value === "") value = "0";
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue > 100) return;
      const studentWeight = 100 - parseInt(numericValue, 10);
      setFormData((prev) => ({
        ...prev,
        teacher_weight_score: numericValue,
        student_weight_score: studentWeight,
      }));
    } else if (fieldName === "student_weight_score") {
      if (value === "") value = "0";
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue > 100) return;
      const teacherWeight = 100 - parseInt(numericValue, 10);
      setFormData((prev) => ({
        ...prev,
        student_weight_score: numericValue,
        teacher_weight_score: teacherWeight,
      }));
    } else {
      setFormData((previousFormData) => ({
        ...previousFormData,
        [fieldName]: value,
      }));
    }
  };

  const handleChangeCheckTeam = (e, position) => {
    const newCheckedTeams = [...checkedTeams];
    newCheckedTeams[position] = !newCheckedTeams[position];
    setCheckedTeams(newCheckedTeams);
  };

  const handleChangeCheckCriteria = (e, position) => {
    const newFormCriterias = formCriterias.map((form, index) => {
      if (index === position) {
        return { criteria: !form.criteria, weight: form.weight };
      }
      return form;
    });
    setFormCriterias(newFormCriterias);
  };

  const handleWeightClick = (e, position) => {
    const newFormCriterias = formCriterias.map((form, index) => {
      if (index === position) {
        return { criteria: form.criteria, weight: "" };
      }
      return form;
    });
    setFormCriterias(newFormCriterias);
  };

  const handleWeightChange = (e, position) => {
    let { value } = e.target;
    if (value === "") value = "0";
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue > 100) return;

    const newFormCriterias = formCriterias.map((form, index) => {
      if (index === position) {
        return { criteria: form.criteria, weight: numericValue };
      }
      return form;
    });
    setFormCriterias(newFormCriterias);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const meeting_data = {
      name,
      description,
      classroom_id: classId,
      owner_id: classMember.id,
      teacher_weight_score: Number(teacher_weight_score) / 100,
      student_weight_score: Number(student_weight_score) / 100,
    };
    const meeting_presentors_data = checkedTeams
      .map((checked, index) => checked && { team_id: teams[index]?.id })
      .filter((team) => team);
    const meeting_criterias_data = formCriterias
      .filter((form) => form.criteria === true)
      .map((form, index) => ({
        criteria_id: criterias[index]?.id,
        weight: Number(form.weight) / 100,
      }));

    console.log("Meeting Data:", meeting_data); // Debug statement
    console.log("Meeting Presentors Data:", meeting_presentors_data); // Debug statement
    console.log("Meeting Criterias Data:", meeting_criterias_data); // Debug statement

    if (!meeting_data.name) {
      setSnackbarMessage("Title must be filled");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    } else if (!meeting_data.description) {
      setSnackbarMessage("Description must be filled");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    } else if (meeting_presentors_data.length < 1) {
      setSnackbarMessage("Teams must be selected");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    } else if (meeting_criterias_data.length < 1) {
      setSnackbarMessage("Criterias must be selected");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    } else if (meeting_criterias_data.reduce((a, b) => a + b.weight, 0) !== 1) {
      setSnackbarMessage("Criterias must add up to 100%");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    } else if (meeting_criterias_data.length > 5) {
      setSnackbarMessage("Criterias must not exceed 5");
      setShowSnackbar(true);
      setIsSaving(false);
      return;
    }

    const meetingResponse = await MeetingsService.create(meeting_data);
    const meeting = meetingResponse.data;
    for (const presentor of meeting_presentors_data) {
      await MeetingsService.addMeetingPresentor(meeting.id, presentor);
    }
    for (const criteria of meeting_criterias_data) {
      await MeetingsService.addMeetingCriteria(meeting.id, criteria);
    }
    setIsSaving(false);
    setFormCriterias(
      criterias?.map(() => ({ criteria: false, weight: "0" })) || []
    );
    setCheckedTeams(teams?.map(() => false) || []);
    setFormData({
      name: "",
      description: "",
      teacher_weight_score: "80",
      student_weight_score: "20",
    });
    handleClose();
  };

  const closeSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
    >
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={closeSnackbar}
        message="Some message"
      >
        <Alert
          onClose={closeSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Create Meeting
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} p={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              minRows={3}
              value={description}
              onChange={handleInputChange}
            />

            <FormGroup>
              <Typography variant="h6" component="div" gutterBottom>
                Teams
              </Typography>
              {(teams || []).map((team, index) => (
                <FormControlLabel
                  key={team.id}
                  control={
                    <Checkbox
                      checked={checkedTeams[index]}
                      onChange={(e) => handleChangeCheckTeam(e, index)}
                    />
                  }
                  label={team.name}
                />
              ))}
            </FormGroup>

            <Typography variant="h6" component="div" gutterBottom>
              Scoring Weights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="teacher_weight_score"
                  name="teacher_weight_score"
                  label="Teacher Weight"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={teacher_weight_score}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  id="student_weight_score"
                  name="student_weight_score"
                  label="Student Weight"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={student_weight_score}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" component="div" gutterBottom>
              Criterias
            </Typography>
            <FormGroup>
              {(criterias || []).map((criteria, index) => (
                <Stack key={criteria.id} direction="row" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formCriterias[index]?.criteria || false}
                        onChange={(e) => handleChangeCheckCriteria(e, index)}
                      />
                    }
                    label={criteria.name}
                  />
                  <TextField
                    margin="dense"
                    id={`criteria-${index}`}
                    name={`criteria-${index}`}
                    label="Weight"
                    type="text"
                    variant="standard"
                    value={formCriterias[index]?.weight || "0"}
                    onClick={(e) => handleWeightClick(e, index)}
                    onChange={(e) => handleWeightChange(e, index)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              ))}
            </FormGroup>
          </Stack>
        </Grid>
      </Grid>
    </Dialog>
  );
}

CreateMeetingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateMeetingDialog;
