import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';
import Header from '../../components/Header/Header';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import { Tiptap } from '../../components/UI/RichTextEditor/TipTap';
import ModalCustom from '../../components/UI/Modal/Modal';
import Loading from '../../components/UI/Loading/Loading';
import { useBoardTemplate, useProjects } from '../../../../hooks';
import styles from './AddBoard.module.css';

function AddBoard() {
  const { id, templateid } = useParams();
  const { createProjectBoard } = useProjects();
  const { getTemplate } = useBoardTemplate();
  const [template, setTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState(sessionStorage.getItem('contents'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTemplate(templateid);
        setTemplate(response.data);
        if (!newContent) {
          setNewContent(response.data.content || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [templateid]);

  useEffect(() => {
    sessionStorage.setItem('contents', newContent);
  }, [newContent]);

  const addProjectBoard = async () => {
    setIsModalOpen(true);
    try {
      const response = await createProjectBoard(id, {
        body: {
          title: template.title,
          content: newContent,
          template_id: templateid,
          novelty: 0,
          capability: 0,
          technical_feasibility: 0,
          feedback: 's',
          recommendation: 's',
          references: 's',
          project_id: id,
        },
      });
      navigate(`/project/${id}/create-board/${response.data.id}/result`);
    } catch (error) {
      console.error('Error creating ProjectBoard:', error);
      Swal.fire({
        title: 'Error. Please try again',
        icon: 'error',
        confirmButtonColor: '#9c7b16',
      });
    }
    setIsModalOpen(false);
    sessionStorage.removeItem('contents');
  };

  const goBack = () => {
    navigate(`/project/${id}/create-board/${templateid}/rules`);
  };

  // if (!template) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className={styles.body}>
      <Header />
      <div className="d-flex">
        <span className={styles.back} onClick={goBack}>
          <IoArrowBackSharp />
        </span>
        <div className={styles.container}>
          {template ? (
            <span>
              <span className={styles.title}>{template.title}</span>
              <Card className={styles.cardContainer}>
                <div className={styles.box} />
                <div className={styles.containerStyle}>
                  <Tiptap setDescription={setNewContent} value={newContent} />
                </div>
              </Card>
            </span>
          ) : (
            <Loading />
          )}
          {isModalOpen && (
            <ModalCustom width={200} isOpen={isModalOpen}>
              <Loading timeout="auto" style={{ height: 'auto' }} />
            </ModalCustom>
          )}
          <Button className={styles.button} onClick={addProjectBoard}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddBoard;
