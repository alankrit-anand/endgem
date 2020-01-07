# endgem

Deployment URL:
  https://endgem-alankrit-anand.herokuapp.com


Instructions:

  1. The site EndGem is a course content management app that keeps the content under various tabs each one corresponding 
     to a course.
  
  2. It sorts the contents of course according to number of total downloads. Change in number of downloads won't be visible
     immediately after download but after refreshing the page, changes wil take place. 
     
  3. The bar-icon shows the list of top 10 downloaded documents among all courses.
  
  4. The plus-icon can be used to add new contents to a course. You need to be logged in to do it.
  
  5. Sign up with google and fb hasn't been made yet. Site's own signup and login system implementing Mongoose-local can
     be used.
     
  6. The download button behaves strangely in mobiles that justs open the file in Google drive instead of downloading it.
     However, it works fine in desktop.
     
  7. There is a hidden router "/courses/new" that can be used to add new courses. You need to be logged in to do it.
  
  
  
  About site back-end:
  
    Platform: NodeJs
    
    Framework: Express
    
    Database: MongoDb
    
    Packages: See packages.json for more info...
    
