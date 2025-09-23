import { useState } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { login, passwordReset, signUp } from '../api/auth';
import { Loading } from './Loading';
import { Field } from './Field';
import { Button } from './Button';
import { Form } from './Form';
import { toErr } from '@common/utils/err';
import { addTr } from '../hooks/useTr';
import { FlexCol } from './Flex';
import { LogIn, UserPlus, Mail, Key, ArrowLeft } from 'lucide-react';

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
                icon={<LogIn />}
                title="Se connecter"
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
              />
              <Button
                title="Mot de passe oublié ?"
                icon={<Key />}
                onClick={() => setPage('forgot-password')}
              />
              <Button
                title="Vous n'avez pas de compte ? Inscrivez-vous"
                icon={<UserPlus />}
                onClick={() => setPage('sign-up')}
              />
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
                title="S'inscrire"
                onClick={async () => {
                  setPage('');
                  await signUp(email, password);
                  setPage('sign-in');
                }}
                color="primary"
                icon={<UserPlus />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                icon={<LogIn />}
                onClick={() => setPage('sign-in')}
              />
            </FlexCol>
          </>
        ) : page === 'forgot-password' ? (
          <>
            {emailField}
            <FlexCol>
              <Button
                title="Réinitialiser le mot de passe par email"
                onClick={async () => {
                  setPage('');
                  await passwordReset(email);
                  setPage('sign-in');
                  // setPage('code');
                }}
                color="primary"
                icon={<Mail />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                icon={<ArrowLeft />}
                onClick={() => setPage('sign-in')}
              />
            </FlexCol>
          </>
        ) : page === 'code' ? (
          <>
            {emailField}
            <Field value={password} onValue={setPassword} label="Le CODE reçu par email" />
            <FlexCol>
              <Button
                title="Connexion avec le CODE"
                onClick={() => {
                  /* signWithCode(email, password) */
                }}
                color="primary"
                icon={<Key />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                onClick={() => setPage('sign-in')}
                icon={<ArrowLeft />}
              />
            </FlexCol>
          </>
        ) : (
          <Loading />
        )}
      </Form>
    </div>
  );
};
