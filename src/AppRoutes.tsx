import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components";
import {
  TrainerList,
  Signup,
  SignIn,
  PricingAndPackages,
  ThankYou,
  FaqPage,
  Chat,
  CurrentLocation,
  LiveLocation,
  Sessions,
  Stats,
  MyProfile,
  ChangePassword,
  PaymentHistory,
  ManagePros,
  ProviderSignIn,
  ProviderSignUp,
  ProviderProfileDetails,
} from "./pages";
import { LoggedInPrivateRoutes, PrivateRoutes, ClientRoute } from "./utils";

const AppRoutes = () => {
  return (
    <>
      {!(
        window.location.pathname.includes("FAQ") ||
        window.location.pathname.includes("PP") ||
        window.location.pathname.includes("TAC") ||
        window.location.pathname.includes("live-location") ||
        window.location.pathname.includes("current-location") ||
        window.location.pathname.includes("provider-sign-up")
      ) ? (
        <Header />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            <ClientRoute>
              <TrainerList />
            </ClientRoute>
          }
        />
        <Route
          path="/:franchise_name/:enquiry_type"
          element={
            <ClientRoute>
              <FaqPage />
            </ClientRoute>
          }
        />
        <Route
          path="/:enquiry_type"
          element={
            <ClientRoute>
              <FaqPage />
            </ClientRoute>
          }
        />
        <Route
          path="/:franchise_name/all"
          element={
            <ClientRoute>
              <TrainerList />
            </ClientRoute>
          }
        />
        <Route element={<LoggedInPrivateRoutes />}>
          <Route path="sign-up" element={<Signup />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="provider-sign-in" element={<ProviderSignIn />} />
          <Route path="provider-sign-up" element={<ProviderSignUp />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route
            path="/messages"
            element={
              <ClientRoute>
                <Chat />
              </ClientRoute>
            }
          />
          <Route
            path="/messages/:with_whom"
            element={
              <ClientRoute>
                <Chat />
              </ClientRoute>
            }
          />
          <Route
            path="/messages/:id/:firstname/:lastname"
            element={
              <ClientRoute>
                <Chat />
              </ClientRoute>
            }
          />
          <Route
            path="/:franchise_name/thank-you"
            element={
              <ClientRoute>
                <ThankYou />
              </ClientRoute>
            }
          />
          <Route
            path="/current-location/:lat/:lng"
            element={
              <ClientRoute>
                <CurrentLocation />
              </ClientRoute>
            }
          />
          <Route
            path="/live-location/:lat/:lng/:roomId"
            element={
              <ClientRoute>
                <LiveLocation />
              </ClientRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ClientRoute>
                <Sessions />
              </ClientRoute>
            }
          />
          <Route
            path="/my-program"
            element={
              <ClientRoute>
                <Stats />
              </ClientRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ClientRoute>
                <MyProfile />
              </ClientRoute>
            }
          />
          <Route
            path="/provider-profile"
            element={<ProviderProfileDetails />}
          />
          <Route
            path="/change-password"
            element={
              <ClientRoute>
                <ChangePassword />
              </ClientRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ClientRoute>
                <PaymentHistory />
              </ClientRoute>
            }
          />
          <Route
            path="/manage-pros"
            element={
              <ClientRoute>
                <ManagePros />
              </ClientRoute>
            }
          />
        </Route>
        <Route
          path="/:franchise_name/packages"
          element={
            <ClientRoute>
              <PricingAndPackages />
            </ClientRoute>
          }
        />
        <Route
          path="/:franchise_name/packages/:service_name"
          element={
            <ClientRoute>
              <PricingAndPackages />
            </ClientRoute>
          }
        />
      </Routes>
      {!(
        window.location.pathname.includes("FAQ") ||
        window.location.pathname.includes("PP") ||
        window.location.pathname.includes("TAC") ||
        window.location.pathname.includes("live-location") ||
        window.location.pathname.includes("current-location")
      ) ? (
        <Footer />
      ) : null}
    </>
  );
};

export { AppRoutes };
