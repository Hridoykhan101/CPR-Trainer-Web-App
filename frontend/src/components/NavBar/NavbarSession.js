import PersonIcon from '@material-ui/icons/Person';
import RequestHelper from '../../RequestHelper';

export const NavbarSession = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      cName: 'dropdown-link'
    },
    {
      title: 'Logout',
      path: '/',
      cName: 'dropdown-link',
      action: RequestHelper.doLogoutRequest
    }
  ];