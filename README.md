# Capstone Project
> I have developed the capstone project basing on the project number 4 - Serverless Application.

# New features
* In this capstone project, I used **Github Action** and **Dockerhub** to set up and run the **Continuous Integration pipeline**.
* Beside that, I also updated 2 more features to the old TODO app, including:
  * Load more todo items
  * Edit todo's name and due date

# How to run the front-end application
```
> cd ./client
> npm install
> npm run start
```
> The front-end application will be running on http://localhost:3000

# Back-end information
```
API ID: n14l277mjh
API Endpoint: https://n14l277mjh.execute-api.us-east-1.amazonaws.com/dev
```
# Screenshots for new features
## 1. CI Pipeline
![Alt text](images/ci-1.png?raw=true "Image 1")
![Alt text](images/ci-2.png?raw=true "Image 2")
![Alt text](images/ci-3.png?raw=true "Image 3")

## 2. Load more todo items
> The button Load More will load 2 more items (if exist)
>
* The first 2 items
![Alt text](images/load-more-1.png?raw=true "The first 2 items")
* Loading more items
![Alt text](images/load-more-2.png?raw=true "Loading more items")
* Two more items returned after loading
![Alt text](images/load-more-3.png?raw=true "2 more items returned after loading")

## 3. View detail and edit todo's information
> User can view todo's detail by clicking on the pencil button. In the edit page, user can change todo's name and due date.
>
* This is how the home page show the first item with name "Buy some food 1" when it has not been updated
![Alt text](images/edit-1.png?raw=true "Image 1")
* This is how it looks like in the todo's detail page
![Alt text](images/edit-2.png?raw=true "Image 1")
* Change the name to "Buy some food 2" and due date to "2023-01-06". Click submit button -> the alert show "Update todo successfully"
![Alt text](images/edit-3.png?raw=true "Image 1")
* Upload another file for todo's attachment. This detail page will update the todo's attachment image as well.
  ![Alt text](images/edit-4.png?raw=true "Image 1")
* By going back to home page, we can see what we have changed to the first todo item.
  ![Alt text](images/edit-5.png?raw=true "Image 1")
