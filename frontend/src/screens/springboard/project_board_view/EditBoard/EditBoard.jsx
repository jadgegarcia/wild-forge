import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';

import Header from '../../components/Header/Header';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import { Tiptap } from '../../components/UI/RichTextEditor/TipTap';
import ModalCustom from '../../components/UI/Modal/Modal';
import Loading from '../../components/UI/Loading/Loading';

import { useProjects } from '../../../../hooks';

import styles from './EditBoard.module.css';

function EditBoard() {
  const { getProjectBoardById, updateProjectBoard } = useProjects();

  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(sessionStorage.getItem('contents'));
  const [boardId, setBoardId] = useState(null);
  const [projectId, SetProjectId] = useState(null);
  const [priorNovelVal, setPriorNovelVal] = useState(null);
  const [priorTechVal, setPriorTechVal] = useState(null);
  const [priorCapableVal, setPriorCapableVal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id, boardid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectBoardById(boardid);
        setTitle(response.data.title || '');
        if (!content) {
          setContent(response.data.content || '');
        }
        setBoardId(response.data.board_id || '');
        SetProjectId(response.data.project_fk || '');

        setPriorNovelVal(response.data.novelty || 0);
        setPriorTechVal(response.data.technical_feasibility || 0);
        setPriorCapableVal(response.data.capability || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [boardid]);

  useEffect(() => {
    sessionStorage.setItem('contents', content);
  }, [content]);

  const updateBoard = async () => {
    setIsModalOpen(true);
    try {
      const response = await updateProjectBoard(boardid, {
        body: {
          title,
          content,
          novelty: priorNovelVal,
          capability: priorCapableVal,
          technical_feasibility: priorTechVal,
          feedback: 'error',
          recommendation: 'error',
          // references: "error",
          project_id: projectId,
          board_id: boardId,
        },
      });
      setIsModalOpen(false);
      navigate(`/project/${id}/board/${response.data.id}/edit/result`);
    } catch (error) {
      setIsModalOpen(false);
      Swal.fire({
        title: 'Error. Please try again',
        icon: 'error',
        confirmButtonColor: '#9c7b16',
      });
      console.error('Error updating ProjectBoard:', error);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('contents');
    navigate(`/project/${id}/board/${boardid}`);
  };

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <span className={styles.title}>
          <span className={styles.back} onClick={handleBack}>
            <IoArrowBackSharp />
          </span>
          {title}
        </span>
        <Card className={styles.cardContainer}>
          <div className={styles.box} />
          {content ? (
            <div className={styles.containerStyle}>
              <Tiptap setDescription={setContent} value={content} />
            </div>
          ) : (
            <Loading />
          )}
        </Card>
        {isModalOpen && (
          <ModalCustom width={200} isOpen={isModalOpen}>
            <Loading timeout="auto" style={{ height: 'auto' }} />
          </ModalCustom>
        )}
        <Button className={styles.button} onClick={updateBoard}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default EditBoard;
