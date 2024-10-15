import { Stack } from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import VerticalSlider from "./VerticalSlider"

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function AppSlider() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Productos", path: "/products" }, { name: "productos" }]} />
      </Box>

      <Stack spacing={3}>
        

        
        <SimpleCard title="Gestion De Productos">
          <VerticalSlider />
        </SimpleCard>

      </Stack>
    </Container>
  );
}
