import { useState } from 'preact/hooks';
import { Css } from '../helpers/html';
import { flexColumn } from '../helpers/flexBox';
import { useCss } from '../hooks/useCss';
import { login, passwordReset, signUp } from '../api';
import { Loading } from './Loading';
import { Field } from './Field';
import { Button, ButtonRow } from './Button';
import { Form } from './Form';
import { toErr } from '../helpers/err';
import { addTranslates } from '../hooks';

addTranslates({
  'Failed to authenticate.': 'Échec, vérifier le mot de passe.',
});

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch', justify: 'center' }),
    w: 30,
    bg: 'white',
  },
};

export const AuthForm = () => {
  const c = useCss('AuthForm', css);
  const isAuthLoading = false; // useMsg(isAuthLoading$);
  const [page, setPage] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailField = (
    <Field
      name="username"
      type="email"
      value={email}
      onValue={setEmail}
      label="Votre adresse e-mail"
      props={{ autoComplete: 'username' }}
    />
  );

  return (
    <Form cls={c}>
      {isAuthLoading ? (
        <Loading />
      ) : page === 'sign-in' ? (
        <>
          {emailField}
          <Field
            name="password"
            type="password"
            value={password}
            onValue={setPassword}
            label="Votre mot de passe"
            props={{ autoComplete: 'current-password' }}
            error={passwordError}
          />
          <ButtonRow>
            <Button
              onClick={async () => {
                setPage('');
                try {
                  await login(email, password);
                  setPasswordError('');
                } catch (error) {
                  setPasswordError(toErr(error).message);
                }
                setPage('sign-in');
              }}
              color="primary"
            >
              Se connecter
            </Button>
            <Button onClick={() => setPage('forgot-password')}>Mot de passe oublié ?</Button>
            <Button onClick={() => setPage('sign-up')}>
              Vous n'avez pas de compte ?<br />
              Inscrivez-vous
            </Button>
          </ButtonRow>
        </>
      ) : page === 'sign-up' ? (
        <>
          {emailField}
          <Field
            name="password"
            type="password"
            value={password}
            onValue={setPassword}
            label="Votre mot de passe"
            props={{ autoComplete: 'new-password' }}
          />
          <ButtonRow>
            <Button
              onClick={async () => {
                setPage('');
                await signUp(email, password);
                setPage('sign-in');
              }}
              color="primary"
            >
              S'inscrire
            </Button>
            <Button onClick={() => setPage('sign-in')}>
              Vous avez déjà un compte ?<br />
              Connectez-vous
            </Button>
          </ButtonRow>
        </>
      ) : page === 'forgot-password' ? (
        <>
          {emailField}
          <ButtonRow>
            <Button
              onClick={async () => {
                setPage('');
                await passwordReset(email);
                setPage('sign-in');
                // setPage('code');
              }}
              color="primary"
            >
              Réinitialiser le mot de passe par email.
            </Button>
            <Button onClick={() => setPage('sign-in')}>
              Vous avez déjà un compte ?<br />
              Connectez-vous.
            </Button>
          </ButtonRow>
        </>
      ) : page === 'code' ? (
        <>
          {emailField}
          <Field value={password} onValue={setPassword} label="Le CODE reçu par email" />
          <ButtonRow>
            <Button
              onClick={() => {
                /* signWithCode(email, password) */
              }}
              color="primary"
            >
              Connexion avec le CODE
            </Button>
            <Button onClick={() => setPage('sign-in')}>
              Vous avez déjà un compte ?<br />
              Connectez-vous
            </Button>
          </ButtonRow>
        </>
      ) : (
        <Loading />
      )}
    </Form>
  );
};
