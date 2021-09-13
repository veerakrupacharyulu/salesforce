import { LightningElement } from 'lwc';
import getSearchedCourses from '@salesforce/apex/SearchCourses.getSearchedCourses'; 
export default class FindCourses extends LightningElement {
    courseList;
    error;
    enrollmentStatus;
    level = 'Beginner';
    position = 'Admin';
    

    get levelOptions() {
        return [
            { label: 'Beginner', value: 'Beginner' },
            { label: 'Intermediate', value: 'Intermediate' },
            { label: 'Advanced', value: 'Advanced' }
        ];
    }

    get positionOptions() {
        return [
            { label: 'Admin', value: 'Admin' },
            { label: 'Business Analyst', value: 'Business Analyst' },
            { label: 'Test Analyst', value: 'Test Analyst' }
        ];
    }
    handlePositionChange(event) {
        this.position = event.detail.value;
        //handleCourseSearch(this.position, this.level);
    }

    handleLevelChange(event){
        this.level = event.detail.value;
        this.handleCourseSearch();
    }

    handleCourseSearch(){

    
        //console.log("handling search key " + position);
        getSearchedCourses({ position: this.position, level : this.level })
             .then((result) => {
                 console.log("Result from the apex method is : " + result);
                 this.courseList = result;
                 //this.enrollmentStatus = this.courseList.Trainings__r[0].EnrollmentStatus__c;
                 //console.log('enrollmentStatus is : '+ this.enrollmentStatus  );
                 this.error = undefined;
                 console.log("ProductList from the apex method is : " + this.courseList);
             })
             .catch((error) => {
                 this.error = error;
             });
    }



}