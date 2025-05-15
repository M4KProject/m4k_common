import { useState } from 'react';
import { Css } from '../helpers/html';
import { flexColumn } from '../helpers/flexBox';
import { useCss } from '../hooks/useCss';
import { useMsg } from '../hooks/useMsg';
import { isAuthLoading$, resetPassword, signIn, signUp, signWithCode } from '../api/auth';
import { Loading } from './Loading';
import { Field } from './Field';
import { Button, ButtonGroup } from './Button';
import { Form } from './Form';

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch', justify: 'center' }),
        width: '30em',
        bg: 'white',
        // p: 2,
        // mr: 2,
    },
}

export const AuthForm = () => {
    const c = useCss('AuthForm', css);
    const isAuthLoading = useMsg(isAuthLoading$);
    const [page, setPage] = useState('sign-in');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailField = <Field type="email" value={email} onValue={setEmail} label="Votre adresse e-mail" props={{ autoComplete: "username" }} />;
    
    return (
        <Form cls={c}>
            {isAuthLoading ? <Loading /> :
            page === 'sign-in' ? (
                <>
                    {emailField}
                    <Field type="password" value={password} onValue={setPassword} label="Votre mot de passe" props={{ autoComplete: "current-password" }} />
                    <ButtonGroup>
                        <Button onClick={() => {
                            signIn(email, password);
                            setPage('');
                        }} color="primary">Se connecter</Button>
                        <Button onClick={() => setPage('forgot-password')}>Mot de passe oublié ?</Button>
                        <Button onClick={() => setPage('sign-up')}>Vous n'avez pas de compte ?<br />Inscrivez-vous</Button>
                    </ButtonGroup>
                </>
            ) :
            page === 'sign-up' ? (
                <>
                    {emailField}
                    <Field type="password" value={password} onValue={setPassword} label="Votre mot de passe" props={{ autocomplete: "new-password" }} />
                    <ButtonGroup>
                        <Button onClick={() => {
                            signUp(email, password);
                            setPage('');
                        }} color="primary">S'inscrire</Button>
                        <Button onClick={() => setPage('sign-in')}>Vous avez déjà un compte ?<br />Connectez-vous</Button>
                    </ButtonGroup>
                </>
            ) :
            page === 'forgot-password' ? (
                <>
                    {emailField}
                    <ButtonGroup>
                        <Button onClick={() => {
                            resetPassword(email);
                            setPage('code');
                        }} color="primary">Réinitialiser le mot de passe par email.</Button>
                        <Button onClick={() => setPage('sign-in')}>Vous avez déjà un compte ?<br />Connectez-vous.</Button>
                    </ButtonGroup>
                </>
            ) :
            page === 'code' ? (
                <>
                    {emailField}
                    <Field value={password} onValue={setPassword} label="Le CODE reçu par email" />
                    <ButtonGroup>
                        <Button onClick={() => signWithCode(email, password)} color="primary">Connexion avec le CODE</Button>
                        <Button onClick={() => setPage('sign-in')}>Vous avez déjà un compte ?<br />Connectez-vous</Button>
                    </ButtonGroup>
                </>
            ) : <Loading />}
        </Form>
    );
}