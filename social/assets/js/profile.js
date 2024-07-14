const dateProfile = document.getElementById("profileDate");
const allPostProfile = document.getElementById("allPostProfile");
const addPostsProfilePageButton = document.querySelector(
  ".addPostsProfilePageButton"
);
let j = 0;

addPostsProfileButton();
noUser();
// get id from link
function getIdQuery() {
  const searchParams = new URLSearchParams(window.location.search);
  let userId = searchParams.get("userId");
  return userId;
}

// show NO User
function noUser() {
  let errorMessage = ` <div
        class="alert alert-danger d-flex align-items-center flex-column flex-lg-row"
        role="alert"
      >
        <div class="text-capitalize flex-grow-1">
          you should signup or login to creat your profile
        </div>
        <div id="loginButtons">
          <button
            type="button"
            data-bs-target="#loginModal"
            data-bs-toggle="modal"
            class="btn btn-success text-capitalize ms-end mt-3 mt-lg-0"
          >
            login
          </button>

          <!-- Sign Up Modal -->
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#signUpModal"
            data-bs-whatever="@mdo"
            class="btn btn-success text-capitalize ms-end mt-3 mt-lg-0"
          >
            signup
          </button>
        </div>
      </div>`;
  if (getIdQuery() == null && localStorage.getItem("user") == null) {
    dateProfile.innerHTML = errorMessage;
  }
}

// Check Add Posts Button
function addPostsProfileButton() {
  try {
    showLoading(true);
    if (JSON.parse(localStorage.getItem("user")).id == getIdQuery()) {
      addPostsProfilePageButton.classList.remove("d-none");
    } else {
      addPostsProfilePageButton.classList.add("d-none");
    }
  } catch {
  } finally {
    showLoading(false);
  }
}

// If Write Profile Html And User FOund
if (localStorage.getItem("user") && getIdQuery() == null) {
  window.location = `/profile.html?userId=${
    JSON.parse(localStorage.getItem("user")).id
  }`;
}

// Check If Query Parms Finded Or NO
if (getIdQuery() != null) {
  // Check If USer Founded Or No
  showDate();

  async function showDate() {
    await getUserDateFromId();
    getProfilePosts();
  }

  // -------- Start Build User Profile

  // Get User Date
  async function getUserDateFromId() {
    try {
      showLoading(true);
      let response = await axios.get(`${mainLinkApi}/users/${getIdQuery()}`);
      dateProfile.innerHTML = "";
      showDateOfProfile(response);
    } catch (error) {
      let errorShow = `
      <div class="alert alert-danger d-flex align-items-center" role="alert">
    <div>
      ${error}
    </div>
  </div>`;
      dateProfile.innerHTML = errorShow;
    } finally {
      showLoading(false);
    }
  }

  // Show Data Of User
  function showDateOfProfile(response) {
    // Check User HAs Image Or No
    let srcImage =
      Object.keys(response.data.data.profile_image).length != 0
        ? `${response.data.data.profile_image}`
        : `/assets/images/postsimage/course-02.jpg`;

    // Build User Content
    let dateUserContent = `
      <div class="card mb-3 bg-body-tertiary p-3">
      <div class="row g-0 justify-content-center justify-content-md-start align-items-lg-center align-items-center">
  
  <div
        class="col-md-3 mt-2 mt-md-0 me-md-5 px-4 py-4 px-md-3 py-md-3"
        id="containerOfUserImageProfile"
        data-bs-toggle="offcanvas" href="#personalImageProfile" role="button" aria-controls="personalImageProfile"
        >
        <img
        src=${srcImage}
              class="img-fluid rounded-circle pointer"
              alt=""
              id="profileUserImage"
            />
  </div>

        <div class="offcanvas offcanvas-start" tabindex="-1" id="personalImageProfile" aria-labelledby="personalImageProfileLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="personalImageProfileLabel">Profile Image</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <div>
               <img src=${srcImage} class="img-fluid pointer" alt="" id="profileUserImage"/>
            </div>
          </div>
        </div>

        <div class="col-md-8" id="dataOfUser">
          <div class="card-body px-4 py-4 px-md-3 py-md-3">
            <p class="card-text" id="userNameProfile">
              Username : ${response.data.data.username}
            </p>
           
            <p class="card-text" id="countPostProfile">
              Count of posts : <span id="postsNumber">${response.data.data.posts_count}</span> 
            </p>
            <p class="card-text" id="countCommentProfile">
              Count of comments : <span id="commentsNumber">${response.data.data.comments_count}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
      `;
    dateProfile.innerHTML = dateUserContent;
  }
  // -------- End Build User Profile
}

// -------- Start Build Posts Profile

// Get Posts
async function getProfilePosts() {
  try {
    showLoading(true);
    let response = await axios.get(
      `${mainLinkApi}/users/${getIdQuery()}/posts`
    );
    await addPostsAfterConditionProfile(response);
  } catch (error) {
    let errorShow = `
    <div class="alert alert-danger d-flex align-items-center" role="alert">
  <div>
    ${error}
  </div>
</div>`;
    allPostProfile.innerHTML = errorShow;
  } finally {
    showLoading(false);
  }
}

// Add Posts On Page
async function addPostsAfterConditionProfile(response) {
  for (let allPostsContent of response.data.data) {
    j++;
    // Check Image And Title  Empty
    await checkTitleNullAndImageNullProfile(allPostsContent);
  }
}

// // Check Post Title None And Image None
async function checkTitleNullAndImageNullProfile(
  allPostsContent,
  postAdded = false
) {
  if (
    Object.keys(allPostsContent.image).length !== 0 &&
    allPostsContent.title != null
  ) {
    await showPostsProfile(
      checkCreatComment(),
      allPostsContent,
      j,
      "d-block",
      "d-block"
    );
  } else if (
    Object.keys(allPostsContent.image).length === 0 &&
    allPostsContent.title != null
  ) {
    await showPostsProfile(
      checkCreatComment(),
      allPostsContent,
      j,
      "d-none",
      "d-block"
    );
  } else if (
    Object.keys(allPostsContent.image).length != 0 &&
    allPostsContent.title === null
  ) {
    await showPostsProfile(
      checkCreatComment(),
      allPostsContent,
      j,
      "d-block",
      "d-none"
    );
  } else {
    await showPostsProfile(
      checkCreatComment(),
      allPostsContent,
      j,
      "d-none",
      "d-none"
    );
    checkCreatComment();
  }
}

// // Post Content
async function showPostsProfile(
  displayCreatComment = "d-inline-block",
  allPostsContent,
  j,
  displayImage,
  displayTitle
) {
  try {
    j++;
    let showOptions = "";
    if (localStorage.getItem("user")) {
      let personName = JSON.parse(localStorage.getItem("user")).username;
      showOptions =
        personName === allPostsContent.author.username
          ? `<div id="postOptions">
           <button
             class="btn btn-outline-success text-capitalize p-1 p-md-2"
             data-bs-target="#edituserPost" data-bs-toggle="modal"
             id="editPost"
             onclick="showPostEditable(${allPostsContent.id})"
           >
             edit
           </button>
           <button
             class="btn btn-outline-danger text-capitalize p-1 p-md-2"
             data-bs-target="#deletedPost" data-bs-toggle="modal"
             id="deletePost"
             onclick="deletedId(${allPostsContent.id})"
           >
             delete
           </button>
         </div>`
          : ``;
    }
    // Bulid Post
    let postContentt = `
     <div class="post mb-5 nn" id ="${allPostsContent.id}">
     <div class="card w-100" id="postCard">

              <div class="card-header d-flex justify-content-between">
                <div class="profileUserId pointer" id="${allPostsContent.author.id}">
                    <img
                    class= "myPersonImageProfile ratio ratio-1x1 rounded-circle"
                    src = ${allPostsContent.author.profile_image}
                    />
                    <span class="fs-6 text-capitalize ms-2 fw-bold userUniqueName">${allPostsContent.author.username}</span>
                </div>
                ${showOptions}
              </div>

                  <div class="card-body overflow-hidden mb-3">
                    <div class="canves ${displayImage}" id="postCanves">
                      <div
                        data-bs-toggle="offcanvas"
                        href="#imageShow-${j}"
                        role="button"
                        aria-controls="imageShow-${j}"
                      >
                        <img
                          src=${allPostsContent.image}
                          class="card-img ratio ratio-1x1 d-block mb-2"
                          id="postImg-${j}"
                          alt="..."
                        />
                      </div>
                      <div
                        class="offcanvas offcanvas-start"
                        data-bs-scroll="true"
                        data-bs-backdrop="false"
                        tabindex="-1"
                        id="imageShow-${j}"
                        aria-labelledby="imageShow-${j}Label"
                      >
                        <div class="offcanvas-header">
                          <h5
                            class="offcanvas-title text-capitalize"
                            id="imageShow-${j}Label"
                          >
                            image
                          </h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                          ></button>
                        </div>
                     <div class="offcanvas-body overflow-hidden">
                          <img
                            src=${allPostsContent.image}
                            class="card-img ratio ratio-1x1 d-block mb-2 h-100"
                            id="postImgCanv"
                            alt="..."
                          />
                        </div>
                      </div>
                    </div>
                    <span class="text-capitalize timePost">${allPostsContent.created_at}</span>
                   <h5 class="card-title mt-3 ${displayTitle}" id="postCardTitle-${j}">${allPostsContent.title}</h5>
                    <p class="card-text" id="postBodyText">
                      ${allPostsContent.body}
                    </p>
                </div>

          <div class="card-footer" id="cardPostFotter">
                        <a  class="pe-auto ${displayCreatComment} pointer creatCommentSpecial"
                        data-bs-target="#creatComment" data-bs-toggle="modal">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pen"
                            viewBox="0 0 16 16"
                            id="add-comment-btn"
                          >
                            <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                            />
                          </svg>
                        </a>
                        <span class="mx-1" id="numberCommentPost-${allPostsContent.id}">(<span id="countComment-${allPostsContent.id}">${allPostsContent.comments_count}</span>)</span>
                        <span>comment</span>
          </div>

     </div>
     </div>
    `;

    allPostProfile.innerHTML += postContentt;

    const postId = document.querySelectorAll(".nn");
    postId.forEach((e) => {
      e.onclick = function () {
        getId(e.id);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

async function creatPostProfile() {
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
    allPostProfile.innerHTML = "";
    if (document.getElementById("postsNumber")) {
      let postsNumber = document.getElementById("postsNumber");
      ++postsNumber.innerHTML;
    }
    getProfilePosts();
  } catch (error) {
    showEmailError(error, "postErrorPost", "postErrorPostMessage", "body");
    showEmailError(error, "postErrorImage", "postErrorImageMessage", "image");
  } finally {
    showLoading(false);
  }
}
// -------- End Build Posts Profile
