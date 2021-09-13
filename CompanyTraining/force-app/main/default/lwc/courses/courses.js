import { LightningElement, api, wire} from 'lwc';

import { publish, MessageContext } from 'lightning/messageService';

import COURSE_DETAIL_CHANNEL from '@salesforce/messageChannel/course_detail__c';

import enrollCourse from '@salesforce/apex/SearchCourses.enrollCourse'; 

import userId from '@salesforce/user/Id';

export default class Courses extends LightningElement {

    @api courseDetails;
    @wire(MessageContext)
    messageContext;
    courseEnrollmentStatus = 'Enroll';

    handleShowCourseDetails(){

        const payload = { 
            Name: this.courseDetails.Name,
            Description: this.courseDetails.Description__c,
            CourseImage: this.courseDetails.Image_URL__c,
            Level: this.courseDetails.Level__c,
            Position: this.courseDetails.Position__c,
            Title : this.courseDetails.Title__c,
            Link: this.courseDetails.Link__c,
            Category: this.courseDetails.Category__c };
        publish(this.messageContext, COURSE_DETAIL_CHANNEL, payload);
        
    }
    handleCourseEnrollment(event){
        this.courseEnrollmentStatus = event.detail.value;
       // if(this.courseEnrollmentStatus == 'Enroll'){
           //console.log("handling search key " + position);
             enrollCourse({courseId: this.courseDetails.Id, enrollmentStatus: this.courseEnrollmentStatus, userId: userId})
        .then((result) => {
            console.log("Result from the apex method is : " + result);
            this.courseList = result;
            this.error = undefined;
            
    
            console.log("ProductList from the apex method is : " + this.courseList);
        })
        .catch((error) => {
            this.error = err;
        });
        //}
    }

}