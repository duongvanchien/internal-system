import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Box, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import BackgroundImage from '../../assets/images/background_staff.png';
import BackgroundBirthdayImage from '../../assets/images/bg_birthday.png';
import FacebookIcon from '../../assets/images/facebook.png';
import InstaIcon from '../../assets/images/insta.png';
import LinkedIcon from '../../assets/images/linkedin.png';
import TaskIcon from '@mui/icons-material/Task';
import Logo from '../../assets/images/logo_staff.png';
import YoutubeIcon from '../../assets/images/youtube.png';
import { FCButton } from '../../components/FCButton';
import { PrivateRoute } from '../../navigation/PrivateRoute';
import { Routes } from '../../navigation/routes';
import { useAppSelector } from "../../redux/hook";
import { authState } from "../../redux/slices/authSlice";
import { AchievementScreen } from '../../screens/staff/achievement';
import { BirthdayScreen } from '../../screens/staff/birthday';
import { EventInfoScreen } from '../../screens/staff/eventInfo';
import { FormScreen } from '../../screens/staff/form';
import { HomeScreen } from '../../screens/staff/home';
import { MemberScreen } from '../../screens/staff/member';
import { ProfileScreen } from '../../screens/staff/profile';
import './styles.scss';
import { TaskScreen } from '../../screens/staff/task';

export const LayoutStaff = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const authReducer = useAppSelector(authState);
    const pages = [
        {
            title: "Trang ch???",
            route: Routes.home,
            privatePage: true
        },
        {
            title: "Th??nh vi??n",
            route: Routes.member,
            privatePage: authReducer.userInfo
        },
        {
            title: "Th??nh t??ch",
            route: Routes.achievement + "/" + authReducer.userInfo?._id,
            privatePage: authReducer.userInfo
        },
        {
            title: "Sinh nh???t",
            route: Routes.birthday,
            privatePage: authReducer.userInfo
        }
    ]
    const history = useHistory();
    const location = useLocation();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = useCallback(
        () => {
            Cookies.remove('user');
            window.location.href = '/';
        }, [])

    const renderHeader = () => {
        return (
            <AppBar position="static">
                <div className="layout_staff_container" style={{ background: location.pathname !== Routes.birthday ? `url(${BackgroundImage}) center` : `url(${BackgroundBirthdayImage}) center` }}>
                    <div className={location.pathname !== Routes.birthday ? "bg_overlay" : "bg_overlay_none"}>
                        <Container maxWidth="xl">
                            <Toolbar disableGutters>
                                <Typography
                                    noWrap
                                    component="div"
                                    sx={{ mr: 2, display: { xs: 'none', md: 'flex', width: "15%" } }}
                                >
                                    <img src={Logo} width="50%" style={{ objectFit: "cover", cursor: 'pointer' }} onClick={() => window.location.href = Routes.home} />
                                </Typography>

                                {/* mobile */}
                                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            display: { xs: 'block', md: 'none' },
                                        }}
                                    >
                                        {pages.map((page, key) => (
                                            <MenuItem key={key} onClick={() => history.push(page.route)}>
                                                <Typography textAlign="center">{page.title}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>

                                {/* desktop */}
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', alignItems: "center" }}>
                                    {
                                        pages.map((page) => {
                                            if (page.privatePage) {
                                                return (
                                                    <FCButton
                                                        variant='text'
                                                        color="inherit"
                                                        text={page.title}
                                                        handleAction={() => history.push(page.route)}
                                                        style={location.pathname === page.route ? { fontWeight: 700, marginRight: '2rem', backgroundColor: "#8490FD", color: "#fff" } : { fontWeight: 700, marginRight: '2rem' }}
                                                    />
                                                )
                                            }
                                        })
                                    }

                                    {!authReducer.userInfo ?
                                        <FCButton
                                            variant='outlined'
                                            color="inherit"
                                            text="????ng nh???p"
                                            handleAction={() => history.push(Routes.login)}
                                            style={{ fontWeight: 700, marginRight: '2rem' }}
                                        /> :
                                        <>
                                            <Tooltip title="Open settings">
                                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                    <Avatar src={authReducer.userInfo?.avatar} />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: '45px' }}
                                                id="menu-appbar"
                                                anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={Boolean(anchorElUser)}
                                                onClose={handleCloseUserMenu}
                                            >
                                                <MenuItem style={{ display: 'flex', alignItems: 'center' }} onClick={() => { history.push(`${Routes.profile}/${authReducer.userInfo?._id}`); setAnchorElUser(null) }}>
                                                    <AutoFixHighRoundedIcon style={{ fontSize: '0.9rem' }} />
                                                    <Typography textAlign="center" style={{ fontSize: '0.9rem', marginLeft: '0.4rem' }}>Th??ng tin c?? nh??n</Typography>
                                                </MenuItem>
                                                <MenuItem style={{ display: 'flex', alignItems: 'center' }} onClick={() => { history.push(Routes.form); setAnchorElUser(null) }}>
                                                    <DescriptionOutlinedIcon style={{ fontSize: '0.9rem' }} />
                                                    <Typography textAlign="center" style={{ fontSize: '0.9rem', marginLeft: '0.4rem' }}>Qu???n l?? ????n</Typography>
                                                </MenuItem>
                                                <MenuItem style={{ display: 'flex', alignItems: 'center' }} onClick={() => { history.push(Routes.task); setAnchorElUser(null) }}>
                                                    <TaskIcon style={{ fontSize: '0.9rem' }} />
                                                    <Typography textAlign="center" style={{ fontSize: '0.9rem', marginLeft: '0.4rem' }}>Danh s??ch c??ng vi???c</Typography>
                                                </MenuItem>
                                                <MenuItem style={{ display: 'flex', alignItems: 'center' }} onClick={handleLogout}>
                                                    <ExitToAppRoundedIcon style={{ fontSize: '0.9rem' }} />
                                                    <Typography textAlign="center" style={{ fontSize: '0.9rem', marginLeft: '0.4rem' }}>????ng xu???t</Typography>
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    }
                                </Box>
                            </Toolbar>
                        </Container>
                    </div>
                </div>
            </AppBar >
        )
    }

    const renderFooter = () => {
        return (
            <div className="footer_container">
                <div className="footer">
                    <Container maxWidth="xl">
                        <img src={Logo} width="5%" style={{ objectFit: "cover" }} />
                        <Grid container spacing={2}>
                            <Grid item sm={8} xs={12}>
                                <Tooltip title="Xem v??? tr??">
                                    <div className="footer_item_contact">
                                        <LocationOnIcon />
                                        <a href="https://g.page/koolsoft-e-learning?share" target="_blank">T???ng 3, L?? NT K??T m???i Ph??ng Khoang, Ph?????ng Trung V??n, Qu???n Nam T??? Li??m, H?? N???i</a>
                                    </div>
                                </Tooltip>

                                <Tooltip title="G???i mail">
                                    <div className="footer_item_contact">
                                        <MailRoundedIcon />
                                        <a href="mailto:koolsoftinc@gmail.com" target="_blank">koolsoftinc@gmail.com</a>
                                    </div>
                                </Tooltip>

                                <Tooltip title="Li??n h???">
                                    <div className="footer_item_contact">
                                        <LocalPhoneRoundedIcon />
                                        <a href="tel:0978180507" target="_blank">0978 180 507</a>
                                    </div>
                                </Tooltip>

                                <div className="footer_description">
                                    Kool Soft E-leaning la?? n????n ta??ng qua??n ly?? trung t??m ??a??o ta??o online, ????????c pha??t tri????n b????i Koolsoft Inc - C??ng ty h??ng ?????u v??? x??y d???ng v?? ph??t tri???n c??c ph???n m???m, ???ng d???ng ph???c v??? h???c t???p, ??n thi.
                                </div>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                <div className="footer_feature">
                                    <h4>TI???N ??CH</h4>
                                    <div className="item">Trang ch???</div>
                                    <div className="item">Th??nh t??ch</div>
                                    <div className="item">Th??nh vi??n</div>
                                    <div className="item">Sinh nh???t</div>
                                </div>

                            </Grid>
                        </Grid>
                    </Container>
                </div>
                <div className="footer_contact">
                    <Container maxWidth="xl">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <div>K???t n???i v???i Koolsoft</div>
                            <div>
                                <img src={YoutubeIcon} className="icon_contact" width="10%"></img>
                                <img src={InstaIcon} className="icon_contact" width="10%"></img>
                                <img src={LinkedIcon} className="icon_contact" width="10%"></img>
                                <img src={FacebookIcon} className="icon_contact" width="10%"></img>
                            </div>
                        </div>

                    </Container>
                </div>
            </div>
        )
    }

    const renderBody = () => {
        return (
            <Container maxWidth="xl">
                <Route path={Routes.home} exact component={HomeScreen} />
                <Route path={Routes.eventInfo + "/:eventId"} exact component={EventInfoScreen} />
                <PrivateRoute path={Routes.member} Component={MemberScreen} />
                <PrivateRoute path={Routes.achievement} Component={AchievementScreen} />
                <PrivateRoute path={Routes.achievement + "/:userId"} Component={AchievementScreen} />
                <PrivateRoute path={Routes.birthday} Component={BirthdayScreen} />
                <PrivateRoute path={Routes.profile + "/:userId"} Component={ProfileScreen} />
                <PrivateRoute path={Routes.form} Component={FormScreen} />
                <PrivateRoute path={Routes.task} Component={TaskScreen} />
            </Container>
        )
    }

    return (
        <>
            {renderHeader()}
            {renderBody()}
            {renderFooter()}
        </>
    );
};