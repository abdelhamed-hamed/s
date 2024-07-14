const mainLinkApi = `https://tarmeezacademy.com/api/v1`;
let bar = document.getElementById("bar");
let logoutButton = document.getElementById("logoutButton");
let loginButtons = document.getElementById("loginButtons");
const date = document.getElementById("date");
let navLink = document.getElementsByClassName("nav-link");
let hh = document.getElementById("hh");
let userNameValue = document.getElementById("userNameValue");
let passwordValue = document.getElementById("passwordValue");
const profile = document.getElementById("profile");
const myPersonImageProfile = document.getElementById("myPersonImageProfile");
const myPersonName = document.getElementById("myPersonName");
const addPost = document.getElementById("addPost");
const emailSignUp = document.getElementById("emailSignUp");
const nameSignUp = document.getElementById("nameSignUp");
const usernameSignUp = document.getElementById("usernameSignUp");
const passwordSignUp = document.getElementById("passwordSignUp");
const signPhoto = document.getElementById("signPhoto");
const upButton = document.getElementById("upButton");
const loader = document.getElementById("loader");

// Comment ID
let creatNewComment = document.getElementById("creatNewComment");
const AddNewComment = document.getElementById("AddNewComment");
let postUniqueId;

// Start Creat Post Id
const titlePost = document.getElementById("titlePost");
const postContentBody = document.getElementById("postContentBody");
const postPhoto = document.getElementById("postPhoto");

// To Edit Post
let editPostValue = document.getElementById("editPostValue");

// End Creat Post Id
let i = 0;

// Page Numbet To Pagination
let pageNmber = 1;
let isLoading = false;

let x = [];

// Check If LocalStorage Has Token Or No
if (localStorage.getItem("token") != null) {
  disAppearLogin();
} else {
  appearLogin();
}
activeLink();
upButtonBehavoir();
logoutDissappear();
// Active Page
function activeLink() {
  Array.from(navLink).forEach((e) => {
    e.addEventListener("click", () => {
      Array.from(navLink).forEach((e) => {
        e.classList.remove("active");
        e.removeAttribute("aria-current");
      });
      e.classList.add("active");
      e.setAttribute("aria-current", "page");
    });
  });
}
// ======== Start Signup Functions ========

// Request To Sign New User
async function signNewUser() {
  const fromDateProfile = appendFromDateSignup();

  try {
    showLoading(true);
    let response = await axios.post(
      `${mainLinkApi}/register`,
      fromDateProfile,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    window.location = "/home.html";
    storeDate(response);
    await userFounded(response);
    // signUpErrorMessage("hide");
    closeModal(`signUpModal`, `signUpButtonAlert`);
  } catch (error) {
    showErrorSignUp(error);
  } finally {
    showLoading(false);
  }
}

// Show Error On Catch
function showErrorSignUp(error) {
  showEmailError(error, "emailSignupError", "emailSignErrorMessage", "email");
  showEmailError(error, "nameSignupError", "nameSignErrorMessage", "name");
  showEmailError(
    error,
    "usernameSignupError",
    "usernameSignErrorMessage",
    "username"
  );
  showEmailError(
    error,
    "passwordSignupError",
    "passwordSignErrorMessage",
    "password"
  );

  showEmailError(error, "signPhotoError", "signPhotoErrorMessage", `image`);
}

// Creat Append From-Date For Profile
function appendFromDateSignup() {
  const formDateProfile = new FormData();
  formDateProfile.append("email", emailSignUp.value);
  formDateProfile.append("name", nameSignUp.value);
  formDateProfile.append("username", usernameSignUp.value);
  formDateProfile.append("password", passwordSignUp.value);
  formDateProfile.append("image", signPhoto.files[0]);
  return formDateProfile;
}

// signup Error
function showEmailError(error, idOfAlertChossed, idOfAlertShowMessage, type) {
  const alertChossed = document.getElementById(`${idOfAlertChossed}`);
  const alertChossedMessage = document.getElementById(
    `${idOfAlertShowMessage}`
  );
  if (error.response.data.errors[type]) {
    alertChossed.classList.remove("d-none");
    alertChossedMessage.innerHTML = `<div>${error.response.data.errors[type]}</div>`;
  } else {
    alertChossed.classList.add("d-none");
  }
}

// ======== End Signup Functions ========

// ======== Start Login Function ========

// Check Login User Found Or No
async function loginToken() {
  let dateUser = {
    username: userNameValue.value,
    password: passwordValue.value,
  };

  try {
    showLoading(true);
    let response = await axios.post(`${mainLinkApi}/login`, dateUser);
    await userFounded(response);
    undefinedUser("hide");
  } catch {
    undefinedUser("show");
  } finally {
    showLoading(false);
  }
}

// Show User Founded
async function userFounded(response) {
  try {
    await storeDate(response);
  } catch {}
  window.location = "/home.html";
  disAppearLogin();
  closeModal("loginModal", `loginButtonAlert`);
  showProfile();
}

// Store Date In Local Storage
async function storeDate(response) {
  localStorage.setItem("token", `${response.data.token}`);
  localStorage.setItem("user", JSON.stringify(response.data.user));
}

// Show Error When User NotFound
function undefinedUser(shown) {
  // CATCH ALERT
  let alertPlaceholder = document.getElementById("undefinedUser");
  // Logic
  if (shown == "show") {
    alertPlaceholder.classList.remove("d-none");
  } else {
    alertPlaceholder.classList.add("d-none");
  }
}

// Close Modal When Login
function closeModal(modalClosed) {
  let modalNeedClose = document.getElementById(`${modalClosed}`);
  let modal = bootstrap.Modal.getInstance(modalNeedClose);
  try {
    modal.hide();
  } catch {}
  hideBar();
}

// Hide Bar On Click Login And LogOut
function hideBar() {
  if (bar.classList.contains("show")) {
    bar.classList.remove("show");
  }
}

// Disappear Login And SignUp
function disAppearLogin() {
  logoutButton.classList.remove("d-none");
  loginButtons.classList.add("d-none");
  closeModal();
  showImageOrHide("show");
  showAddPost("show");
}

// show Person Image And Name
function showImageOrHide(shown) {
  if (shown == "show") {
    date.classList.remove("d-none");
    getImageAndUserName();
  } else {
    date.classList.add("d-none");
  }
}

// get Image And Name Of User From Local Storage
function getImageAndUserName() {
  const userDAte = JSON.parse(localStorage.getItem("user"));
  try {
    myPersonImageProfile.src = userDAte.profile_image;
    myPersonName.innerHTML = userDAte.username;
  } catch {}
}

// Show Add Post When Login
function showAddPost(shown) {
  if (shown == "show") {
    addPost.innerHTML = `
           <button class="rounded-circle btn btn-primary p-2">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  class="bi bi-plus d-flex justify-content-center align-items-center fs-3"
                  viewBox="0 0 16 16"
                  id="svgAddPost"
              >
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                />
              </svg>
      </button>
      `;
    getImageAndUserName();
  } else {
    addPost.innerHTML = "";
  }
}

// Appear Login When Logout
function appearLogin() {
  logoutButton.classList.add("d-none");
  loginButtons.classList.remove("d-none");
  localStorage.clear();
  hideBar();
  showImageOrHide("hide");
  showAddPost("hide");
  checkCreatComment();
}

// ======== End LogIn Functions ========

// Logout Buttons Disapear
function logoutDissappear() {
  logoutButton.addEventListener("click", () => {
    logoutButton.classList.add("d-none");
    date.classList.add("d-none");
    loginButtons.classList.remove("d-none");
    window.location.reload();
  });
}
// Check Comment Display
function checkCreatComment() {
  let checked = localStorage.getItem("token") ? "d-inline-block" : "d-none";
  return checked;
}
// ======== Start Creat Post Functions ========

// Creat Request Of Creat
async function creatPost() {
  try {
    showLoading(true);
    let fromDate = appendFromDate();
    let response = await axios.post(`${mainLinkApi}/posts`, fromDate, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // i++;
    // getFrist();
    closeModal("addPostmodal");
    emptyPostCreat();
    allPosts.innerHTML = "";
    pageNmber = 1;
    getPosts();
  } catch (error) {
    showEmailError(error, "postErrorPost", "postErrorPostMessage", "body");
    showEmailError(error, "postErrorImage", "postErrorImageMessage", "image");
  } finally {
    showLoading(false);
  }
}

function emptyPostCreat() {
  titlePost.value = "";
  postContentBody.value = "";
  postPhoto.value = "";
}

// Creat Append From-Date For Post
function appendFromDate() {
  const formDatePost = new FormData();
  formDatePost.append("title", titlePost.value);
  formDatePost.append("body", postContentBody.value);

  if (postPhoto.files.length > 0) {
    formDatePost.append("image", postPhoto.files[0]);
    return formDatePost;
  } else {
    return formDatePost;
  }
}

// ======== End Creat Post Functions ========

// ======== Start Edit Post Functions ========

// To Get Body Of Post Editable

async function showPostEditable(id) {
  postUniqueId = id;
  try {
    showLoading(true);
    let response = await axios.get(`${mainLinkApi}/posts/${postUniqueId}`);
    editPostValue.value = `${response.data.data.body}`;
  } catch (error) {
    console.log(error);
  } finally {
    showLoading(false);
  }
}

// Edit Post
async function editUserPost() {
  try {
    showLoading(true);
    let postBodyText = document.getElementById("postBodyText");
    let bodyPostEdit = {
      body: `${editPostValue.value}`,
    };

    let response = await axios.put(
      `${mainLinkApi}/posts/${postUniqueId}`,
      bodyPostEdit,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    postBodyText.innerHTML = response.data.data.body;
    closeModal("edituserPost");
  } catch (error) {
    console.log(error);
  } finally {
    showLoading(false);
  }
}

// ======== End Edit Post Functions ========

// ======== Start Delete Post Functions ========

// Deleted Post Id
function deletedId(id) {
  postUniqueId = id;
}

// Delete Post
async function deletePost() {
  let postDeleted = document.getElementById(`${postUniqueId}`);
  try {
    showLoading(true);
    let response = await axios.delete(`${mainLinkApi}/posts/${postUniqueId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    closeDelete();
    if (document.getElementById("postsNumber")) {
      let postsNumber = document.getElementById("postsNumber");
      --postsNumber.innerHTML;
    }
    postDeleted.style.display = "none";
  } catch (error) {
    console.log(error);
  } finally {
    showLoading(false);
  }
}

// Close Delete
function closeDelete() {
  closeModal("deletedPost");
}

// // ======== End Delete Post Functions ========

// ======== Start Creat Comment Functions ========

// Get ID Of Posts And Store In Post Unique ID
async function getId(postId) {
  postUniqueId = postId;
}

// Requst Add Comment
async function creatNewCommentPost() {
  try {
    showLoading(true);
    let commentError = document.getElementById("commentError");
    let contentComment = { body: creatNewComment.value };
    let response = await axios.post(
      `${mainLinkApi}/posts/${postUniqueId}/comments`,
      contentComment,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    closeModal("creatComment");
    creatNewComment.value = "";
    let countComment = document.querySelector(
      `#cardPostFotter #numberCommentPost-${postUniqueId} #countComment-${postUniqueId}`
    );
    ++countComment.innerHTML;
    if (document.getElementById("commentsNumber")) {
      let commentsNumber = document.getElementById("commentsNumber");
      ++commentsNumber.innerHTML;
    }
    commentError.style.display = "none";
  } catch (error) {
    console.log(error);
    commentError.style.display = "block";
    showEmailError(error, "commentError", "commentErrorMessage", "body");
  } finally {
    showLoading(false);
  }
}

// ======== End Creat Comment Functions ========

// Up Button
function upButtonBehavoir() {
  window.onscroll = function () {
    if (scrollY >= 600) {
      upButton.classList.remove("d-none");
      clickUp();
    } else {
      upButton.classList.add("d-none");
    }
  };
}

// FUnction Click Up
function clickUp() {
  upButton.onclick = function () {
    window.scrollTo(0, 0);
  };
}

function showLoading(show = true) {
  if (show) {
    loader.style.display = "flex";
  } else {
    loader.style.display = "none";
  }
}
