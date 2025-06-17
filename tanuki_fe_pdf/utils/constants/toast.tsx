import { ToastType } from "@/types";

// #region Create dynamic toast messages

// #region Error

// Error - Unrecognized error
export const TOAST_ERROR_SOME_ERROR: ToastType = {
  status: "error",
  msg: (
    <>
      Some error occurred.
      <br />
      エラーが発生しました。
    </>
  ),
};

// Error - Invalid passcode
export const TOAST_ERROR_INVALID_PASSCODE: ToastType = {
  status: "error",
  msg: (
    <>
      Invalid passcode.
      <br />
      パスコードが無効です。
    </>
  ),
};

// Error - No nodes selected
export const TOAST_ERROR_NO_NODES_SELECTED: ToastType = {
  status: "error",
  msg: (
    <>
      No nodes selected.
      <br />
      ノードが選択されていません。
    </>
  ),
};

// Error - Request timed out
export const TOAST_ERROR_REQUEST_TIMED_OUT: ToastType = {
  status: "error",
  msg: (
    <>
      Request timed out.
      <br />
      リクエストがタイムアウトしました。
    </>
  ),
};

// Error - No internet
export const NO_INTERNET_ERROR = {
  status: "error",
  msg: (
    <>
      Could not connect to the internet.
      <br />
      リクエストがタイムアウトしました。
    </>
  ),
};

// #endregion Error

// #region Info

// Already in center position
export const TOAST_INFO_COMING_SOON: ToastType = {
  status: "info",
  msg: (
    <>
      Coming soon...
      <br />
      近日公開...
    </>
  ),
};

// Control the opacity
export const TOAST_INFO_CONTROL_OPACITY: ToastType = {
  status: "info",
  msg: (
    <>
      You can now control the opacity.
      <br />
      不透明度を制御できるようになりました。
    </>
  ),
};

// Control the display of nodes to show/hide
export const TOAST_INFO_CONTROL_DISPLAY: ToastType = {
  status: "info",
  msg: (
    <>
      You can now control to show/hide the nodes.
      <br />
      ノードの表示/非表示を制御できるようになりました。
    </>
  ),
};

// #endregion Info

// #region Success

export const TOAST_SUCCESS_SKILLS_CLEARED: ToastType = {
  status: "success",
  msg: (
    <>
      Skills have been cleared.
      <br />
      スキルはクリアされました。
    </>
  ),
};

export const TOAST_ERROR_LOGIN: ToastType = {
  status: "error",
  msg: (
    <>
      Could not login now.
      <br />
      現在ログインできませんでした。
    </>
  ),
};

// #endregion Success
export const TOAST_WARNING_NO_CHILDREN_NODES: ToastType = {
  status: "warning",
  msg: (
    <>
      No children nodes available.
      <br />
      利用可能な子ノードはありません。
    </>
  ),
};
