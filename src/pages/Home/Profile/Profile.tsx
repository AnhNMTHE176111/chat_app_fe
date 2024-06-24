import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { initialize, useAppDispatch, useAuth } from "../../../hooks";
import {
  ChangeProfileInformationParams,
  changeInformation,
  getCurrentUser,
  getProfile,
} from "../../../services";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddressInput,
  AvatarInput,
  DateOfBirthInput,
  DescriptionInput,
  FullNameInput,
  GenderInput,
  PhoneInput,
  ProfileCard,
} from "../../../components";
import { Email } from "@mui/icons-material";
import { showNotificationAction } from "../../../stores/notificationActionSlice";

export const Profile = () => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, dispatch } = useAuth();
  const dispatchNoti = useAppDispatch();
  const { control, handleSubmit, reset } =
    useForm<ChangeProfileInformationParams>({
      defaultValues: {
        fullName: "",
        avatar: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        gender: "",
        description: "",
        background: "",
      },
    });

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id)
        .then((res) => {
          if (res.success) {
            reset(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          dispatchNoti(
            showNotificationAction({
              message: err?.message?.data?.message || "Something went wrong",
              severity: "error",
            })
          );
          return;
        });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ChangeProfileInformationParams> = async (
    data
  ) => {
    if (user?.id) {
      changeInformation(user.id, data)
        .then(async (res) => {
          if (res.success) {
            try {
              const response = await getCurrentUser();
              dispatch(
                initialize({ user: response.data.user, isAuthenticated: true })
              );
            } catch (error) {
              console.log("error from AuthProvider", error);
              dispatch(
                initialize({
                  user: null,
                  isAuthenticated: false,
                })
              );
            }

            dispatchNoti(
              showNotificationAction({
                message: res.message || "Update success",
                severity: "success",
              })
            );
            return;
          }
        })
        .catch((err) => {
          dispatchNoti(
            showNotificationAction({
              message: err?.response?.data?.message || "Something wrong",
              severity: "error",
            })
          );
          return;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ backgroundColor: "#e6e3e3" }}
    >
      <Container maxWidth={"lg"} sx={{ height: "100%", display: "flex" }}>
        <Container
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            margin: "10px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box p={2}>
                <Typography variant={"h5"}>General Information</Typography>
              </Box>
              <Box display={"flex"} flexDirection={"column"} p={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box display="flex" flexDirection="row" gap={2}>
                    <TextField
                      margin="dense"
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Email"
                      value={user?.email}
                      sx={{ my: 1.5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                    <FullNameInput control={control} name={"fullName"} />
                  </Box>

                  <Box display="flex" flexDirection="row" gap={2}>
                    <PhoneInput control={control} name={"phone"} />
                    <GenderInput control={control} name={"gender"} />
                  </Box>

                  <Box display="flex" flexDirection="row" gap={2}>
                    <AddressInput control={control} name={"address"} />
                    <DateOfBirthInput control={control} name={"dateOfBirth"} />
                  </Box>
                  <DescriptionInput
                    control={control}
                    name={"description"}
                    rows={3}
                  />
                  <Box display="flex" flexDirection="column">
                    <AvatarInput
                      control={control}
                      name={"avatar"}
                      title="Choose Profile Picture"
                    />
                    <AvatarInput
                      control={control}
                      name={"background"}
                      title="Choose Background Picture"
                    />
                  </Box>
                  <Box display="flex" flexDirection="row" gap={2}>
                    <Button variant={"contained"} type="submit">
                      Save All
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setOpenProfileDialog(true)}
                    >
                      Preview profile
                    </Button>
                    <ProfileCard
                      id={user?.id as string}
                      open={openProfileDialog}
                      onClose={() => setOpenProfileDialog(false)}
                    />
                  </Box>
                </form>
              </Box>
            </>
          )}
        </Container>
      </Container>
    </Box>
  );
};

export default Profile;
