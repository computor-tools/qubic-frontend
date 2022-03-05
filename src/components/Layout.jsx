import React, { forwardRef, useContext, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import CallMadeIcon from '@mui/icons-material/CallMade';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Qubic from '../qubic.png';
import { AuthContext } from './AuthProvider';
import styled from 'styled-components';
import ActiveLink from './ActiveLink';
import Search from './Search';
import ConnectionStatus from './ConnectionStatus';
import BackButton from './BackButton';
import Input from './Input';

const Header = styled.header`
  position: sticky;
  z-index: 1000;
  top: 0;
  background: #121212;
  padding: 0 2vw;
  box-shadow: 0 0 10px #121212;
`;

const MainHeader = styled.div`
  min-height: 55px;
  display: flex;
  align-items: center;
  padding: 0 1vw 0 1vw;
`;

const Logo = styled.img`
  margin-right: 1vw;
  width: 75px;
  align-self: center;
`;

const Nav = styled.nav`
  align-self: center;
  display: flex;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 0;
  margin: 0 0 0 1vw;
  padding: 0;
  color: #fff;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    color: #00ffe9;
  }
`;

const WalletHeaderContainer = styled.div`
  display: flex;
  position: relative;
  margin-left: calc(75px + 2vw);
  padding-right: calc(1vw - 10px);
  padding-bottom: 5px;
  justify-content: space-between;
`;

const Select = styled.select`
  background: transparent;
  color: #fff;
  border-radius: 30px;
  padding: 5px 10px;
  font-weight: bold;
  font-size: 16px;
  border: 1px solid #777;
`;

const Energy = styled.div`
  position: relative;
  display: flex;
  font-weight: bold;
  align-items: center;
`;

const EnergyValue = styled.div`
  margin-left: 10px;
`;

const EnergyButton = styled.div`
  width: ${function (props) {
    return props.width || 'auto';
  }};
  background-color: ${function (props) {
    return props.backgroundColor || '#00ffe9';
  }};
  font-size: ${function (props) {
    return props.fontSize || '16px';
  }};
  font-weight: bold;
  padding: 0.5vh 1vw;
  border: 0;
  border-radius: 30px;
  margin-left: 1vw;
  align-self: ${function (props) {
    return props.alignSelf;
  }};
  color: #000;
  cursor: pointer;
`;

const Subnav = styled.nav`
  padding: 0;
  display: flex;
  margin-left: calc(75px + 2vw);
  padding-bottom: 5px;
`;

const IconLinkText = styled.span`
  margin-left: 5px;
`;

const IconLink = function ({ to, Icon, children }) {
  return (
    <ActiveLink to={to} fontSize="16px">
      <Icon />
      <IconLinkText>{children}</IconLinkText>
    </ActiveLink>
  );
};

const WalletHeader = function () {
  const { client, energy } = useContext(AuthContext);
  const [editEnergy, setEditEnergy] = useState(false);
  const [newEnergy, setNewEnergy] = useState(0);

  return (
    <WalletHeaderContainer>
      <Routes>
        <Route path={'/receive'} element={<BackButton />} />
        <Route path={'/send'} element={<BackButton />} />
        <Route path={'/exchange'} element={<BackButton />} />
        <Route path={'/orders'} element={<BackButton />} />
      </Routes>
      <Energy>
        <Select>
          <option>QU</option>
        </Select>
        <EnergyValue>Energy: {energy?.toString() || 0} QU</EnergyValue>
        {editEnergy && (
          <Input
            marginLeft="1vw"
            type="number"
            value={newEnergy?.toString()}
            onChange={function (event) {
              setNewEnergy(event.target.value);
            }}
          />
        )}
        <EnergyButton
          onClick={async function () {
            if (editEnergy) {
              try {
                await client.setEnergy(newEnergy);
                setEditEnergy(false);
              } catch (error) {
                console.log(error);
              }
            } else {
              setNewEnergy(energy);
              setEditEnergy(true);
            }
          }}
        >
          {editEnergy ? 'Save' : 'Set energy'}
        </EnergyButton>
      </Energy>
      <Nav>
        <IconLink to="/wallet/send" fontSize="16px" Icon={CallMadeIcon}>
          Send
        </IconLink>
        <IconLink to="/wallet/exchange" fontSize="16px" Icon={SwapHorizIcon}>
          Exchange
        </IconLink>
        <IconLink to="/wallet/orders" fontSize="16px" Icon={LibraryBooksIcon}>
          Orders
        </IconLink>
      </Nav>
    </WalletHeaderContainer>
  );
};

const StatsNav = function () {
  return (
    <Subnav>
      <ActiveLink to="/stats/overview">Overview</ActiveLink>
      <ActiveLink to="/stats/computors">Computors</ActiveLink>
      <ActiveLink to="/stats/qubics">Qubics</ActiveLink>
      <ActiveLink to="/stats/qus">QUs</ActiveLink>
    </Subnav>
  );
};

const ForwardLayoutRef = function (_, ref) {
  const { loggedIn, logout } = useContext(AuthContext);

  return (
    <>
      <Header ref={ref}>
        <MainHeader>
          <Logo src={Qubic} alt="Qubic" />
          <Nav>
            <ActiveLink to="/wallet">Wallet</ActiveLink>
            <ActiveLink to="/author">Author</ActiveLink>
            <ActiveLink to="/computor">Computor</ActiveLink>
            <ActiveLink to="/stats">Stats</ActiveLink>
          </Nav>
          <Search />
          <ConnectionStatus />
          <ActiveLink padding="0 0 0 1vw" to="/settings" className="no-underline">
            <SettingsIcon />
          </ActiveLink>
          {loggedIn === true && (
            <LogoutButton
              onClick={function () {
                logout();
              }}
            >
              Logout
            </LogoutButton>
          )}
        </MainHeader>
        <Routes>
          <Route path="/wallet/*" element={<WalletHeader />} />
          <Route path="/stats/*" element={<StatsNav />} />
        </Routes>
      </Header>
      <Outlet />
    </>
  );
};

const Layout = forwardRef(ForwardLayoutRef);

export default Layout;
