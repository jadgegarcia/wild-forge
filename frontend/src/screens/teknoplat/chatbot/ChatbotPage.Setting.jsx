import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { useState } from "react";

const ChatbotPageSetting = () => {
    const [slider, setSlider] = useState({
        general_specific: localStorage.getItem("general_specific") ? Number(localStorage.getItem("general_specific")) : 0.5,
        lenient_harsh: localStorage.getItem("lenient_harsh") ? Number(localStorage.getItem("lenient_harsh")) : 0.5,
        optimistic_pessimistic: localStorage.getItem("optimistic_pessimistic") ? Number(localStorage.getItem("optimistic_pessimistic")) : 0.5
    });

    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setSlider((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    const handleSaveClick = (e) => {
        localStorage.setItem("general_specific", slider.general_specific);
        localStorage.setItem("lenient_harsh", slider.lenient_harsh);
        localStorage.setItem("optimistic_pessimistic", slider.optimistic_pessimistic);
    }

    const handleResetClick = (e) => {
        const newSlider = {
            general_specific: 0.5,
            lenient_harsh: 0.5,
            optimistic_pessimistic: 0.5
        }
        setSlider(newSlider);
        localStorage.setItem("general_specific", newSlider.general_specific);
        localStorage.setItem("lenient_harsh", newSlider.lenient_harsh);
        localStorage.setItem("optimistic_pessimistic", newSlider.optimistic_pessimistic);
    }

    return (
        <Box p={3} py={5}>
            <Stack spacing={5}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">General</Typography>
                    <Slider
                        aria-label="general-to-specific"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="general_specific"
                        value={slider['general_specific']}
                        onChange={handleSliderChange}
                    />
                    <Typography sx={{ width: "150px" }}>Specific</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">Lenient</Typography>
                    <Slider
                        aria-label="lenient-to-harsh"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="lenient_harsh"
                        value={slider['lenient_harsh']}
                        onChange={handleSliderChange}
                    />
                    <Typography sx={{ width: "150px" }}>Harsh</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">Optimistic</Typography>
                    <Slider
                        aria-label="optimistic-to-pessimistic"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="optimistic_pessimistic"
                        value={slider['optimistic_pessimistic']}
                        onChange={handleSliderChange}
                    />
                    <Typography sx={{ width: "150px" }}>Pessimistic</Typography>
                </Stack>
                <Stack direction="row" spacing={3} justifyContent="end">
                    <Button variant="contained" onClick={handleSaveClick}>Save</Button>
                    <Button variant="contained" onClick={handleResetClick}>Reset</Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default ChatbotPageSetting;
