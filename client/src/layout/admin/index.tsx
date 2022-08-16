import CelebrationIcon from '@mui/icons-material/Celebration';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuIcon from '@mui/icons-material/Menu';
import ReduceCapacityOutlinedIcon from '@mui/icons-material/ReduceCapacityOutlined';
import { TreeItem, TreeView } from '@mui/lab';
import { Avatar, Box, Divider, Tooltip } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Cookies from 'js-cookie';
import * as React from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Logo from "../../assets/images/logo.jpg";
import { FCIconButton } from '../../components/FCIconButton';
import { Routes } from '../../navigation/routes';
import { useAppSelector } from "../../redux/hook";
import { authState } from "../../redux/slices/authSlice";
import { DashBoardScreen } from '../../screens/admin/dashboard';
import { DepartmentScreen } from '../../screens/admin/department';
import { EventManagermentScreen } from '../../screens/admin/event';
import { FormManagementScreen } from '../../screens/admin/form';
import { StaffScreen } from '../../screens/admin/staff';
import {WorksManagerment } from '../../screens/admin/works'
import { AdminTimeSheetScreen } from '../../screens/admin/time_sheets';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import './styles.scss';

const drawerWidth = 260;
const appbarHeight = 70;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
  [theme.breakpoints.up('sm')]: {
    width: 0,
  },
});

const AppbarLogoIcon = styled('div')(({ theme }) => ({
  width: drawerWidth,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: 'none',
  height: appbarHeight,
  padding: "8px",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export default function LayoutAdmin() {
  const [open, setOpen] = React.useState(true);
  const [expanded, setExpanded] = React.useState<string[]>();
  const [selected, setSelected] = React.useState<string[]>();
  const history = useHistory()
  const location = useLocation()
  const authReducer = useAppSelector(authState);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleRouting = (route: string) => {
    history.push(route)
  }

  const handleLogout = React.useCallback(
    () => {
      Cookies.remove('user');
      window.location.href = Routes.home;
    },
    [],
  )

  const renderAppBar = () => {
    return (
      <>
        <CssBaseline />
        <AppBar position="fixed" open={open} style={{ width: "100%" }}>
          <Toolbar style={{ padding: 0, display: 'flex', justifyContent: 'space-between' }}>
            <AppbarLogoIcon>
              <div className="logo_main">
                <img src={Logo} width={48} />
                <h5 className="m-0">KOOLSOFT</h5>
              </div>
              <FCIconButton handleAction={handleDrawerOpen} icon={<MenuIcon />} />
            </AppbarLogoIcon>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
              <div style={{ fontWeight: 700 }}>{authReducer.userInfo?.name}</div>
              <Avatar alt={authReducer.userInfo?.name} src={authReducer.userInfo?.avatar} style={{ margin: '0 0.5rem' }} />
              <Tooltip title="Đăng xuất">
                <LogoutRoundedIcon className="btn_logout" onClick={() => handleLogout()} />
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
      </>
    )
  }

  const renderDrawer = () => {
    return (
      <Drawer variant="permanent" open={open} className="cus_drawer">
        <div style={{ marginTop: appbarHeight + "px" }}></div>
        <TreeView
          aria-label="controlled"
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          className="cus_treeview"
          defaultSelected={[location.pathname]}
        >
          <div className="text_treeview">Trang chủ</div>
          <TreeItem
            nodeId={Routes.dashboard}
            label="Trang chủ"
            icon={<DashboardOutlinedIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.dashboard)}
          />
          <Divider style={{ margin: '1rem 0' }} />
          <div className="text_treeview" style={{ margin: 0 }}>Nhân viên</div>
          <div className="sub_text_treeview">Quản lý nhân viên</div>
          <TreeItem
            nodeId={Routes.staff}
            label="Nhân viên"
            icon={<GroupOutlinedIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.staff)}
          />

          <TreeItem
            nodeId={Routes.timeSheets}
            label="Bảng chấm công"
            icon={<ListAltIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.timeSheets)}
          />

          <TreeItem
            nodeId={Routes.formManagerment}
            label="Quản lý đơn"
            icon={<HistoryEduOutlinedIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.formManagerment)}
          />
          <TreeItem
            nodeId={Routes.workManagerment}
            label="Công việc"
            icon={<FormatListBulletedIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.workManagerment)}
          />
          <Divider style={{ margin: '1rem 0' }} />

          <div className="text_treeview" style={{ margin: 0 }}>Phòng ban</div>
          <div className="sub_text_treeview">Quản lý phòng ban</div>
          <TreeItem
            nodeId={Routes.department}
            label="Phòng ban"
            icon={<ReduceCapacityOutlinedIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.department)}
          />

          <Divider style={{ margin: '1rem 0' }} />

          <div className="text_treeview" style={{ margin: 0 }}>Sự kiện</div>
          <div className="sub_text_treeview">Quản lý sự kiện</div>
          <TreeItem
            nodeId={Routes.eventManagerment}
            label="Sự kiện"
            icon={<CelebrationIcon />}
            className="cus_treeitem"
            onClick={() => handleRouting(Routes.eventManagerment)}
          />
        </TreeView >
      </Drawer >
    )
  }

  const renderBody = () => {
    return (
      <>
        <Route path={Routes.dashboard} exact component={DashBoardScreen} />
        <Route path={Routes.staff} exact component={StaffScreen} />
        <Route path={Routes.timeSheets} exact component={AdminTimeSheetScreen} />
        <Route path={Routes.department} exact component={DepartmentScreen} />
        <Route path={Routes.eventManagerment} exact component={EventManagermentScreen} />
        <Route path={Routes.formManagerment} exact component={FormManagementScreen} />
        <Route path={Routes.workManagerment} exact component={WorksManagerment} />
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {renderAppBar()}
      {renderDrawer()}
      <Box component="main" sx={{ p: 3, flexGrow: 1 }} style={{ backgroundColor: '#e3f2fd', marginTop: appbarHeight + "px", borderRadius: '1rem 1rem 0 0' }}>
        {renderBody()}
      </Box>
    </Box>
  );
}