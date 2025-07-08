import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import menuAside from '@/constants/menuAside'
import menuNavBar from '@/constants/menuNavBar'
import BaseIcon from '@/components/Base/BaseIcon'
import NavBar from '@/components/Navbar/NavBar'
import NavBarItemPlain from '@/components/Navbar/NavBarItemPlain'
import AsideMenu from '@/components/Aside/AsideMenu'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import FormField from '@/components/Form/FormField'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { getMe, logout } from '@/stores/thunks/auth'
import Cookies from 'js-cookie'

type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  const darkMode = useAppSelector((state) => state.style.darkMode)
  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  // Initialize auth when the layout mounts
  useEffect(() => {
    // Only check if we don't have a user yet
    if (!user) {
      // Get token from cookie
      const token = Cookies.get('token')
      if (token) {
        dispatch(getMe())
          .unwrap()
          .catch(() => {
            dispatch(logout())
            router.push('/login')
          })
      }
    }
  }, [dispatch, user, router])

  // Handle route changes
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events])

  const layoutAsidePadding = 'xl:pl-60'

  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 overflow-hidden`}
      >
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''}`}
        >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <BaseIcon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain useMargin>
            <Formik
              initialValues={{
                search: '',
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              <Form>
                <FormField isBorderless isTransparent>
                  <Field name="search" placeholder="Search" />
                </FormField>
              </Form>
            </Formik>
          </NavBarItemPlain>
        </NavBar>

        {/* Notice we're using the original menu instead of filtering it here */}
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
        />

        {children}
      </div>
    </div>
  )
}
