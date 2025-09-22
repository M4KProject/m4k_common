import { useState } from 'preact/hooks';
import { Css } from '@common/ui/html';
import { login, passwordReset, signUp } from '../api/auth';
import { Loading } from './Loading';
import { Field } from './Field';
import { Button } from './Button';
import { Form } from './Form';
import { toErr } from '@common/utils/err';
import { addTr } from '../hooks/useTr';
import { FlexCol } from './Flex';

addTr({
  'Failed to authenticate.': 'Échec, vérifier le mot de passe.',
});

const c = Css('AuthForm', {
  '': {
    fCol: ['stretch', 'center'],
    w: 30,
    bg: 'bg',
  },
  ' .Form': {
    elevation: 0,
    border: 0,
  },
});

export const AuthForm = () => {
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
    <div class={c()}>
      <Form>
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
            <FlexCol>
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
                Vous n'avez pas de compte ?
                <br />
                Inscrivez-vous
              </Button>
            </FlexCol>
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
            <FlexCol>
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
            </FlexCol>
          </>
        ) : page === 'forgot-password' ? (
          <>
            {emailField}
            <FlexCol>
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
            </FlexCol>
          </>
        ) : page === 'code' ? (
          <>
            {emailField}
            <Field value={password} onValue={setPassword} label="Le CODE reçu par email" />
            <FlexCol>
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
            </FlexCol>
          </>
        ) : (
          <Loading />
        )}
      </Form>
    </div>
  );
};
