'use strict';

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
};
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloudLink').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-authorListLink').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
};

{ const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;

    
  /* [DONE] remove class 'active' from all aritcle links */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active from all articles */
  const activeArticles = document.querySelectorAll('.posts article');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector = '') {

  customSelector = customSelector.replace('#', '');
  /* [DONE] Remove title list from left column */
  const titleList = document.querySelector(opt.titleListSelector); 
  titleList.innerHTML = '';

  /* [DONE] for all of articles */
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  let html = '';

  for(let article of articles) {  

    /* [DONE] find article 'id' and save as 'const' */
    const articleId = article.getAttribute('id');

    /* [DONE]  find article title and save its content as const */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
  
    /* [DONE] create html link <a> and save it as const */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>'+ articleTitle + '</span></a></li>';
    //console.log('linkHTML: ', linkHTML);
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* [DONE] insert html code to title list at left column */
    titleList.insertAdjacentHTML('afterbegin', linkHTML);
    
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks(); 


function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999,
  };

  for(let tag in tags) {

    if (params.max < tags[tag]) {
      params.max = tags[tag];
    }

    if (params.min > tags[tag] ) {
      params.min = tags[tag];
    }
  }
  
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);
  return opt.cloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object*/
  let allTags = {};
  
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);

  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    const tagsList = article.querySelector(opt.articleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');

    /* split tags into array */
    const tagsArray = tags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of tagsArray) {

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>' + '       ';
      //console.log('linkHTML: ', linkHTML);
      const linkHTMLData = {tag: tag, };
      const linkHTML = templates.articleTagLink(linkHTMLData);
      
      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else { 
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsList.insertAdjacentHTML('afterbegin', html);
    
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  
  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links html code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* START LOOP for each tag in allTags: */
  for(let tag in allTags) {

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>';

    allTagsData.tags.push ({
      tag: tag,
      count: allTags[tag],
      class: calculateTagClass(allTags[tag], tagsParams),
    });
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.insertAdjacentHTML('afterbegin', templates.tagCloudLink(allTagsData));
  //  tagList.innerHTML = templates.tagCloudLink(allTagsData);

  for(let tag of document.querySelectorAll('.list.tags a')) {
    tag.addEventListener('click', tagClickHandler);
  }
}

function tagClickHandler(event) {
  
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks) {

    /* remove class active */
    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.post-tags a');

  /* START LOOP: for each link */
  for(let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

generateTags();

addClickListenersToTags();

function generateAuthors () {
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  
  /* START LOOP: for every article: */
  for(let article of articles) {

    /* find authors wrapper */
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);

    /* get authors from data-author attribute */
    const author = article.getAttribute('data-author');

    /* make html variable with empty string */
    let html ='';

    /* generate HTML of the link */
    const linkHTMLData = {author: author,};
    const linkHTML = templates.articleAuthorLink(linkHTMLData);

    /* add generated code to html variable */
    html = html + linkHTML;

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[author]) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    /* insert HTML of the link into the author wrapper */
    authorWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  const authorList = document.querySelector('.authors');
  const allAuthorsData = {authors: []};
  
  for(let author in allAuthors) {
    allAuthorsData.authors.push ({
      author: author,
      count: allAuthors[author],
    });
  }
  authorList.innerHTML = templates.authorListLink(allAuthorsData);
}

generateAuthors ();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-','');

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  
  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks) {

    /* remove class active */
    activeAuthorLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="#author-' + author + '"]');

  /* START LOOP: for each found author link */
  for(let authorLink of authorLinks) {

    /* add class active */
    authorLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){

  /* find all links to authors */
  //const authorLinks = document.querySelectorAll('.post-author a');
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  }
    
  /* END LOOP: for each link */
}

addClickListenersToAuthors();
  
}