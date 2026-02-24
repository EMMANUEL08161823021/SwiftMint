'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Button, IconButton } from '@mui/material';

// Icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { BrandIcon } from "./BrandIcon";
import { getUser } from "@/store/user/selectors";
import { toggleLoggedOutModal } from '@/store/user/slice';
import LogOutDialog from '@/app/(auth)/logout/dialog/LogOutDialog';

export function TopNavbar() {
    const dispatch = useDispatch()
    const user = useSelector(getUser)

    return (
        <AppBar position="static" sx={{ backgroundColor: '#fff', height: '55px' }}>
            <div className={'py-2 px-5 flex justify-between'}>
                <Link href={"/dashboard"}><div className={'flex items-center gap-2'}>
                    <BrandIcon />
                    <span className={'text-red-500 text-sm font-bold'}>Control Panel</span>
                </div></Link>
                <div className={'flex items-center gap-3'}>
                    <div>
                        <Link href={`/team-directory`}>
                            <IconButton color={'primary'}><ManageAccountsIcon /></IconButton>
                        </Link>
                        <Link href={`/my-settings`}>
                            <IconButton color={'primary'}><SettingsOutlinedIcon /></IconButton>
                        </Link>
                        <IconButton color={'primary'}><NotificationsActiveIcon /></IconButton>
                    </div>
                    <div className={'text-gray-800 flex items-center gap-2'}>
                        <div className={'w-[30px] h-[30px] bg-gray-500 text-white flex items-center justify-center text-xs font-bold rounded-full'}>
                            {user?.firstName && user?.firstName[0]}{user?.lastName && user?.lastName[0]}
                        </div>
                        <div className={'text-xs'}>
                            <p className={'font-bold'}>{user?.firstName} {user?.lastName}</p>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => dispatch(toggleLoggedOutModal(true))}
                        variant={'primary'}
                        sx={{ backgroundColor: '#ef4444' }}
                    >Logout</Button>
                </div>
            </div>
            <LogOutDialog />
        </AppBar>
    )
}