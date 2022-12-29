import Head from "next/head";

import { useEffect, ChangeEvent, useRef, useState } from "react";
import FileUpload from "./fileUplaod";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [user, setUser] = useState({ name: "", id: "" });
  const [uiLogin, setLogin] = useState(true);
  const [accessToken, setAccessToken] = useState();
  const [pageId, setPageId] = useState();
  const [pageAccessToken, setPageAccessToken] = useState();
  const [grantedScopes, setGrantedScopes] = useState();
  const [postText, setPostText] = useState();
  console.log("pageId", pageId);
  console.log("pageAccessToken", pageAccessToken);

  // uplaod image

  // const [image, setImage] = useState(null);
  // const [createObjectURL, setCreateObjectURL] = useState(null);

  // const uploadToClient = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const i = event.target.files[0];

  //     setImage(i);
  //     setCreateObjectURL(URL.createObjectURL(i));
  //   }
  // };

  // uplaod image

  useEffect(() => {
    const app_id = "564976968379492";
    console.log("app_id", app_id);
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: app_id,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v15.0",
      });
      window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          console.log(response.authResponse);

          setAccessToken(response.authResponse.accessToken);
          setGrantedScopes(response.authResponse.grantedScopes);
          FB.api(
            `/me/accounts?access_token=${response.authResponse.accessToken}`,
            function (response) {
              if (response && !response.error) {
                setPageAccessToken(response?.data?.[0].access_token);
                setPageId(response?.data?.[0].id);
              }
            }
          );
          FB.api("/me", function (response) {
            setUser(response);
          });
          setLogin(false);
        } else if (response.status === "not_authorized") {
          // The user hasn't authorized your application.  They
          // must click the Login button, or you must call FB.login
          // in response to a user gesture, to launch a login dialog.
          setLogin(true);
        } else {
          // The user isn't logged in to Facebook. You can launch a
          // login dialog with a user gesture, but the user may have
          // to log in to Facebook before authorizing your application.
          setLogin(true);
        }
      });
    };
  }, []);

  const login = () => {
    try {
      FB.login(
        function (response) {
          if (response.authResponse) {
            // response all data
            console.log(response);
            // response all data

            setAccessToken(response.authResponse.accessToken);
            setGrantedScopes(response.authResponse.grantedScopes);
            FB.api(
              `/me/accounts?access_token=${response.authResponse.accessToken}`,

              function (response) {
                if (response && !response.error) {
                  setPageAccessToken(response?.data?.[0].access_token);

                  setPageId(response?.data?.[0].id);
                }
              }
            );

            FB.api("/me", function (response) {
              setUser(response);
            });

            setLogin(false);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },

        {
          scope: "public_profile,pages_read_engagement,pages_manage_posts",

          return_scopes: true,
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const post = () => {
    FB.api(
      // post image
      // `/${pageId}/photos?url=https://lh3.googleusercontent.com/5Ecse55Ysa3Ju5f4Idr1qt_LMn53mZd5j1Xk1NYGKp1_QQG8IutJX-7RoHPMW-3JPv3qxp_7Qd_ZPuNVm2O5eZQIXQ=w640-h400-e365-rj-sc0x00ffffff&access_token=${pageAccessToken}`,
      // post text
      // `/${pageId}/feed?message=${postText}&access_token=${pageAccessToken}`,
      // get likes
      // `/${pageId}/feed?fields=comments.limit(1).summary(true)&likes.limit(1).summary(true)&access_token=${pageAccessToken}`,

      `/${pageId}/feed?fields=likes.limit(1).summary(true)&access_token=${pageAccessToken}`,
      "GET",

      // "POST",
      function (response) {
        console.log(response.error?.message);
        if (response && !response.error) {
          console.log(response.data[0].likes.summary);
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!uiLogin && (
          <>
            <h1 className={styles.title}>
              {user.name}
              <br />
              {user.id}
            </h1>
            <p>{grantedScopes}</p>
            <br />
            <br />
            <br />
            <textarea
              style={{ width: "500px", fontSize: "18px", padding: "10px" }}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Message..."
              rows="8"
            />

            {/* <div>
              <img src={createObjectURL} />
              <h4>Select Image</h4>
              <input type="file" name="myImage" onChange={uploadToClient} />
            </div> */}

            <button
              onClick={post}
              style={{ padding: "12px 50px 12px 50px", marginTop: "20px" }}
            >
              post
            </button>
          </>
        )}

        {uiLogin && (
          <button
            onClick={login}
            style={{ padding: "12px 50px 12px 50px", marginTop: "20px" }}
          >
            login
          </button>
        )}
      </main>

      <footer className={styles.footer}>Powered by FaceBook API</footer>
    </div>
  );
}
