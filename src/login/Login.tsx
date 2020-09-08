import React from 'react'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {loginThunk} from '../store/login-reducer';
import {AppRootStateType} from '../store/store';
import {Redirect} from 'react-router-dom';

export const Login = () => {
    const isAuth = useSelector( (state: AppRootStateType) => state.auth.isAuth)
    const dispatch = useDispatch()
    const formik = useFormik({
        validate: (value) => {
            if (!value.email) {
                return {
                    email: 'email is required'
                }
            }
            if (!value.password) {
                return {
                    password: 'password is required'
                }
            }
        },
        initialValues: {
            email: 'free@samuraijs.com',
            password: 'free',
            rememberMe: true
        },
        onSubmit: values => {
            dispatch(loginThunk(values))
        },
    })
    if (isAuth){
        return <Redirect to={'/'} />
    }
    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox/>}
                            {...formik.getFieldProps('rememberMe')}
                            checked={formik.values.rememberMe}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>

                    </FormGroup>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                        target={'_blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
