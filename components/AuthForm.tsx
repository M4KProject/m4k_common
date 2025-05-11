import { useState } from 'react';
import { Css } from '../helpers/html';
import { flexColumn } from '../helpers/flexBox';
import { useCss } from '../hooks/useCss';
import { useMsg } from '../hooks/useMsg';
import { isAuthLoading$, signIn, signUp, signWithCode } from '../api/auth';
import { Div } from './Div';
import { Loading } from './Loading';
import { Field } from './Field';
import { Button } from './Button';

const css: Css = {
    '&': {
        ...flexColumn({ align: 'stretch', justify: 'center' }),
        width: '30em',
        bg: 'white',
        p: 2,
        mr: 2,
    },
}

export const AuthForm = () => {
    const c = useCss('AuthForm', css);
    const isAuthLoading = useMsg(isAuthLoading$);
    const [page, setPage] = useState('sign-in');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailField = <Field type="email" value={email} onValue={setEmail} label="Your email address" props={{ autocomplete: "username" }} />;
    
    return (
        <Div cls={c}>
            {isAuthLoading ? <Loading /> :
            page === 'sign-in' ? (
                <>
                    {emailField}
                    <Field type="password" value={password} onValue={setPassword} label="Your password" props={{ autocomplete: "current-password" }} />
                    <Button color="primary" onClick={() => signIn(email, password)}>
                        Sign in
                    </Button>
                    <Div cls={`${c}Links`}>
                        <Button onClick={() => setPage('forgot-password')}>
                            Forgot your password?
                        </Button>
                        <Button onClick={() => setPage('sign-up')}>
                            Don't have an account? Sign up
                        </Button>
                    </Div>
                </>
            ) :
            page === 'sign-up' ? (
                <>
                    {emailField}
                    <Field type="password" value={password} onValue={setPassword} label="Your password" props={{ autocomplete: "new-password" }} />
                    <Button color="primary" onClick={() => signUp(email, password)}>
                        Sign up
                    </Button>
                    <Div cls={`${c}Links`}>
                        <Button onClick={() => setPage('sign-in')}>
                            Already have an account? Sign in
                        </Button>
                    </Div>
                </>
            ) :
            page === 'code' ? (
                <>
                    {emailField}
                    <Field type="password" value={password} onValue={setPassword} label="Code" />
                    <Button color="primary" onClick={() => signWithCode(email, password)}>
                        Connexion avec le CODE
                    </Button>
                    <Div cls={`${c}Links`}>
                        <Button onClick={() => setPage('sign-in')}>
                            Already have an account? Sign in
                        </Button>
                    </Div>
                </>
            ) : <Loading />}
        </Div>
    );
}