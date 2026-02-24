import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '@/store/user/selectors';
import { getTokenFromBrowser } from '@/store/constants';
import { useEffect } from 'react';
import { loadCurrentUser } from '@/store/user/actions';
import {
  AGENT_DIRECTORY,
  COMPANIES,
  CUSTOMER_REQUESTS,
  DASHBOARD,
  FORGOT_PASSWORD,
  LICENSES,
  LOGIN,
  MFA_LOGIN,
  MFA_SETUP,
  MY_SETTINGS,
  ONBOARD,
  PRODUCTS,
  RESET_PASSWORD,
  SUBSCRIBERS,
  TEAM_DIRECTORY,
} from '@/routes/routes';

const protectedRoutes = [
  `/${DASHBOARD}`,
  `/${TEAM_DIRECTORY}`,
  `/${MY_SETTINGS}`,
  `/${PRODUCTS}`,
  `/${CUSTOMER_REQUESTS}`,
  `/${COMPANIES}`,
  `/${LICENSES}`,
  `/${AGENT_DIRECTORY}`,
  `/${SUBSCRIBERS}`,
];

const mfaRoutes = [`/${MFA_SETUP}`, `/${MFA_LOGIN}`];

const authRoutes = [
  `/${LOGIN}`,
  `/${ONBOARD}`,
  `/${FORGOT_PASSWORD}`,
  `/${RESET_PASSWORD}`,
];

export default function withAuth(WrappedComponent) {
  return (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const token = useSelector(getToken) || getTokenFromBrowser();
    // const userRole = useSelector(getUserRole)

    useEffect(() => {
      if (token && !mfaRoutes.includes(pathname)) {
        dispatch(loadCurrentUser());
      }
      if (authRoutes.includes(pathname) && token) {
        router.push(`/${DASHBOARD}`);
      }
      if (protectedRoutes.includes(pathname) && !token) {
        router.push(`/${LOGIN}`);
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}
