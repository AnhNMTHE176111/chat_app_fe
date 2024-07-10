import Sidebar from "../components/HomeForm/Sidebar";
import Header from "../components/HomeForm/Header";
import { Drawer, Grid } from "@mui/material";
import { useDrawerState } from "../hooks";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const { open } = useDrawerState();

  return (
    <Grid
      container
      spacing={0}
      style={{
        backgroundColor: "#ba90b9",
        width: "100vw",
        height: "100vh",
        minWidth: "360px",
        minHeight: "640px",
      }}
    >
      <Grid item xs={12} height={"5%"} children={<Header />} />
      <Grid item xs={12} style={{ display: "flex" }} height={"95%"}>
        <Grid item xs={1} maxHeight={"95%"}>
          <Sidebar />
        </Grid>
        <Grid
          item
          xs={open ? 9 : 10.5}
          style={{
            backgroundColor: "white",
            height: "97%",
          }}
          children={children}
        />
      </Grid>
    </Grid>
  );
};

export default HomeLayout;
