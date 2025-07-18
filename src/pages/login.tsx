import React, { useEffect } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'
import BaseButton from '@/components/Base/BaseButton'
import CardBox from '@/components/Cardbox/CardBox'
import SectionFullScreen from '@/components/Section/SectionFullScreen'
import LayoutGuest from '@/layouts/Guest'
import { Field, Form, Formik } from 'formik'
import FormField from '@/components/Form/FormField'
import FormCheckRadio from '@/components/Form/FormCheckRadio'
import BaseDivider from '@/components/Base/BaseDivider'
import BaseButtons from '@/components/Base/BaseButtons'
import { useRouter } from 'next/router'
import { getPageTitle } from '@/config'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { login } from '@/stores/thunks/auth'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const notify = (type, msg) => toast(msg, { type })
  const { user, errorMessage, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, dispatch, router])
  useEffect(() => {
    if (errorMessage) {
      notify('error', errorMessage)
    }
  }, [errorMessage])

  const handleSubmit = async (value) => {
    const { remember, ...rest } = value
    await dispatch(login(rest))
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen bg="violet">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12">
          <Formik
            initialValues={{
              login: 'admin@gmail.com',
              password: '1111',
              remember: true,
            }}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label="Login" help="Please enter your login">
                <Field name="login" />
              </FormField>

              <FormField label="Password" help="Please enter your password">
                <Field name="password" type="password" />
              </FormField>

              <div className={'flex justify-between'}>
                <FormCheckRadio type="checkbox" label="Remember">
                  <Field type="checkbox" name="remember" />
                </FormCheckRadio>

                <Link className={'text-blue-600'} href={'/forgot'}>
                  Forgot password?
                </Link>
              </div>

              <BaseDivider />

              <BaseButtons>
                <BaseButton
                  className={'w-full'}
                  type="submit"
                  label={loading ? 'Loading...' : 'Login'}
                  color="info"
                  disabled={loading}
                />
              </BaseButtons>
              <br />
              <p className={'text-center text-gray-600'}>
                Don’t have account yet?{' '}
                <Link className={'text-blue-600'} href={'/register'}>
                  New Account
                </Link>
              </p>
            </Form>
          </Formik>
        </CardBox>
      </SectionFullScreen>
      <ToastContainer />
    </>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}
