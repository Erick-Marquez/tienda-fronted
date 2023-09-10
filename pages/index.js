import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import AppConfig from '../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { AuthService } from '../services/AuthService';
import { useAuth } from '../hooks/auth';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' })

    useEffect(() => {
        document.documentElement.style.fontSize = 14 + 'px'
    }, [])

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    async function onClicklogin() {
        login({
            email,
            password,
            remember: checked,
            setErrors,
            setStatus,
        })
        // await AuthService.getCsrfCookie()
        // let data = await AuthService.logIn({
        //     email: email,
        //     password: password
        // })
        // console.log(data)
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />

                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido a ¡Mama Mia!</div>
                            <span className="text-600 font-medium">Inicia sesión para continuar</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText 
                                inputid="email1" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="text" 
                                placeholder="Email o usuario" 
                                className="w-full md:w-30rem mb-5" 
                                style={{ padding: '1rem' }} 
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password 
                                inputid="password1"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Contraseña" 
                                toggleMask 
                                className="w-full mb-5" 
                                inputClassName="w-full p-3 md:w-30rem"
                                feedback={false}
                            />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Recuerdame</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    ¿Olividaste tu contraseña?
                                </a>
                            </div>
                            <Button label="Iniciar Sesión" className="w-full p-3 text-xl" onClick={onClicklogin}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
};
export default LoginPage;
