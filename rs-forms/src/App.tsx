import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from './store';
import {
  openModal,
  closeModal,
  saveData,
  clearHighlight,
} from './store/form-slice';
import { Modal } from './form/modal';
import { UniversalForm } from './form/form';
import type { FormValues } from './interfaces';
import styles from './app.module.css';
import { useEffect } from 'react';
import { fileToBase64 } from './utils/file-to-base-64';

export const App = () => {
  const dispatch = useDispatch();
  const { isModalOpen, mode, dataList, lastAddedId } = useSelector(
    (state: RootState) => state.form
  );

  useEffect(() => {
    if (lastAddedId) {
      const timer = setTimeout(() => {
        dispatch(clearHighlight());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedId, dispatch]);

  return (
    <>
      {dataList.length > 0 && (
        <div className={styles.dataList}>
          <h3>Saved User Data:</h3>
          {dataList.map((user) => (
            <div
              key={user.id}
              className={`${styles.userCard} ${
                lastAddedId === user.id ? styles.highlight : ''
              }`}
            >
              <pre>{JSON.stringify(user, null, 2)}</pre>
              {user.avatarBase64 && (
                <img src={user.avatarBase64} alt="Avatar" width={100} />
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => dispatch(closeModal())}>
        {mode && (
          <UniversalForm
            mode={mode}
            onSubmit={async (formData: FormValues) => {
              let avatarBase64: string | null = null;

              if (formData.avatar instanceof File) {
                avatarBase64 = await fileToBase64(formData.avatar);
              }

              dispatch(
                saveData({
                  name: formData.name,
                  age: formData.age,
                  email: formData.email,
                  gender: formData.gender,
                  country: formData.country,
                  agreement: formData.agreement,
                  avatarBase64,
                })
              );
            }}
          />
        )}
      </Modal>

      <div className={styles.buttons_block}>
        <button onClick={() => dispatch(openModal('controlled'))}>
          Controlled Form
        </button>
        <button onClick={() => dispatch(openModal('uncontrolled'))}>
          Uncontrolled Form
        </button>
      </div>
    </>
  );
};
