import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Box,
  Button as MUIButton,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import axios from 'axios';
import './StartQuiz.css';

const StartQuiz = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    code: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .min(10, 'Za krótki kod')
      .max(10, 'Za długi kod')
      .required('Kod jest wymagany'),
  });

  const onSubmit = async (data, { setFieldError }) => {
    setServerError('');
    try {
      await axios.get(`http://localhost:8000/api/quiz/${data.code}/`);
      navigate(`/quiz/${data.code}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFieldError('code', 'Nieprawidłowy kod quizu.');
      } else {
        setServerError('Wystąpił błąd serwera. Spróbuj ponownie później.');
      }
    }
  };

  return (
    <Box className="start-quiz-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Aby przejść do rozwiązywania quizu, wpisz <strong>KOD</strong> przesłany przez nauczyciela lub twórcę testu.
      </Typography>

      <Paper elevation={4} sx={{ padding: 4, marginTop: 3, borderRadius: 3, width: '100%', maxWidth: 400 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
              <Typography variant="subtitle1" gutterBottom>
                Podaj kod quizu:
              </Typography>

              <Field
                as={TextField}
                name="code"
                label="Kod quizu"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-danger"
                style={{ marginBottom: '1rem', color: 'red' }}
              />

              {serverError && <Alert severity="error">{serverError}</Alert>}

              <MUIButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2, fontWeight: 'bold' }}
              >
                Rozpocznij
              </MUIButton>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default StartQuiz;
