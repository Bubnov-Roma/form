import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from './store';
import { openModal, closeModal, saveData } from './store/slice';
import { Modal } from './form/modal';
import { UniversalForm } from './form/form';
import type { FormValues } from './interfaces';

export const App = () => {
  const dispatch = useDispatch();
  const { isModalOpen, mode, data } = useSelector(
    (state: RootState) => state.form
  );

  return (
    <div>
      <button onClick={() => dispatch(openModal('controlled'))}>
        Open Controlled Form
      </button>
      <button onClick={() => dispatch(openModal('uncontrolled'))}>
        Open Uncontrolled Form
      </button>

      {data && (
        <div>
          <h3>Saved User Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          {data.avatarBase64 && (
            <img src={data.avatarBase64} alt="Avatar" width={100} />
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => dispatch(closeModal())}>
        {mode && (
          <UniversalForm
            mode={mode}
            defaultValues={data ?? undefined}
            onSubmit={(formData: FormValues) => {
              dispatch(
                saveData({
                  name: formData.name,
                  age: formData.age,
                  email: formData.email,
                  gender: formData.gender,
                  country: formData.country,
                  agreement: formData.agreement,
                  avatarBase64: data?.avatarBase64 ?? null,
                })
              );
            }}
          />
        )}
      </Modal>
    </div>
  );
};
