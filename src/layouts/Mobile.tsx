import { Outlet } from 'react-router-dom';
import { Container, Content, OutletContent, HeaderBar } from './Mobile.styled';

const Mobile = () => {
  return (
    <Container>
      <Content>
        <HeaderBar>카카오맵 실시간 그리기</HeaderBar>
        <OutletContent>
          <Outlet />
        </OutletContent>
      </Content>
    </Container>
  );
};

export default Mobile;
