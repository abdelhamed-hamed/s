getPosts();

// Turn On Scroll Pagination
checkScrollToBagination();

// Show Profile Page
function showPersonalProfilePage() {
  if (localStorage.getItem("user")) {
    let localStorageUSer = JSON.parse(localStorage.getItem("user"));
    window.location = `profile.html?userId=${localStorageUSer.id}`;
  } else {
    window.location = `profile.html`;
  }
}

// ============== Start Functions Of Posts ==========

// Get Posts
async function getPosts() {
  try {
    showLoading(true);
    let response = await axios.get(
      `${mainLinkApi}/posts?limit=4&page=${pageNmber}`
    );
    await addPostsAfterCondition(response);
  } catch (error) {
    let errorShow = `
    <div class="alert alert-danger d-flex align-items-center" role="alert">
  <div>
    ${error}
  </div>
</div>`;
    allPosts.innerHTML = errorShow;
  } finally {
    showLoading(false);
  }
}

// Add Posts On Page
async function addPostsAfterCondition(response) {
  for (let allPostsContent of response.data.data) {
    i++;
    // Check Image And Title  Empty
    await checkTitleNullAndImageNull(allPostsContent);
    pageNmber += 1;
  }
}

// Check Post Title None And Image None
async function checkTitleNullAndImageNull(allPostsContent, postAdded = false) {
  if (
    Object.keys(allPostsContent.image).length !== 0 &&
    allPostsContent.title != null
  ) {
    await showPosts(
      checkCreatComment(),
      allPostsContent,
      i,
      "d-block",
      "d-block"
    );
  } else if (
    Object.keys(allPostsContent.image).length === 0 &&
    allPostsContent.title != null
  ) {
    await showPosts(
      checkCreatComment(),
      allPostsContent,
      i,
      "d-none",
      "d-block"
    );
  } else if (
    Object.keys(allPostsContent.image).length != 0 &&
    allPostsContent.title === null
  ) {
    await showPosts(
      checkCreatComment(),
      allPostsContent,
      i,
      "d-block",
      "d-none"
    );
  } else {
    await showPosts(
      checkCreatComment(),
      allPostsContent,
      i,
      "d-none",
      "d-none"
    );
    checkCreatComment();
  }
}

// Post Content
async function showPosts(
  displayCreatComment = "d-inline-block",
  allPostsContent,
  i,
  displayImage,
  displayTitle
) {
  try {
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
                        href="#imageShow-${i}"
                        role="button"
                        aria-controls="imageShow-${i}"
                      >
                        <img
                          src=${allPostsContent.image}
                          class="card-img ratio ratio-1x1 d-block mb-2"
                          id="postImg-${i}"
                          alt="..."
                        />
                      </div>
                      <div
                        class="offcanvas offcanvas-start"
                        data-bs-scroll="true"
                        data-bs-backdrop="false"
                        tabindex="-1"
                        id="imageShow-${i}"
                        aria-labelledby="imageShow-${i}Label"
                      >
                        <div class="offcanvas-header">
                          <h5
                            class="offcanvas-title text-capitalize"
                            id="imageShow-${i}Label"
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
                   <h5 class="card-title mt-3 ${displayTitle}" id="postCardTitle-${i}">${allPostsContent.title}</h5>
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

    allPosts.innerHTML += postContentt;
    const postId = document.querySelectorAll(".nn");
    postId.forEach((e) => {
      e.onclick = function () {
        getId(e.id);
      };
    });

    // Sen ID Of All User
    let profileUserId = document.querySelectorAll(".profileUserId");
    showAnyUserProfile(profileUserId);
  } catch (error) {}
}

// Show Profile date
function showAnyUserProfile(allIdOfElement) {
  allIdOfElement.forEach((e) => {
    e.onclick = function () {
      window.location = `profile.html?userId=${e.id}`;
    };
  });
}

// ======== Start Creat Pagination Functions ========

// Check Scroll To Pagination
async function checkScrollToBagination(doOrNo) {
  window.addEventListener("scroll", async () => {
    const scrollHeight = document.body.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      if (!isLoading) {
        isLoading = true;
        await getPosts();
        isLoading = false;
      }
    }
  });
}

// ======== End Creat Pagination Functions ========
