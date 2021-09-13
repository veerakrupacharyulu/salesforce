import { LightningElement,track,api } from 'lwc';
import findCourses from '@salesforce/apex/TrainingCourseController.findCourses';
import getCourse from '@salesforce/apex/TrainingCourseController.getCourse';
import saveAssignement from '@salesforce/apex/TrainingCourseController.saveAssignement';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



import My_Resource from '@salesforce/resourceUrl/TraineeCourses';
export default class TrainingCourses extends LightningElement {
    @track data = [];
    courseId;
	  @track course;
    @track isCoursefound = false;
    error;
    @api recordId;
    recordPageUrl;
    wiredActivities;

    positionValue = 'All';
    levelValue = 'All';
    get levelOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Beginner', value: 'Beginner' },
            { label: 'Advanced', value: 'Advanced' },
            { label: 'Intermediate', value: 'Intermediate' },
        ];
    }
    

    get positionOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Business Analyst', value: 'Business Analyst' },
            { label: 'Admin', value: 'Admin' },
            { label: 'Developer', value: 'Developer' },
            { label: 'Test Analyst', value: 'Test Analyst' },
        ];
    }

    handlePositionChange(event) {
        this.positionValue = event.detail.value;
        this.handleSearchKeyword();
    }
    handleLevelChange(event) {
      this.levelValue = event.detail.value;
      this.handleSearchKeyword();
  }
  handleSearchKeyword() {
        
         findCourses({
                traineeId: this.recordId,
                position: this.positionValue,
                level: this.levelValue
            })
            .then(result => {
                // set @track contacts variable with return contact list from server  
                this.contactsRecord = result;

                let lstdata = JSON.parse(JSON.stringify(result));
                lstdata.forEach(element => {
                element.courseImage = My_Resource+'/'+element.courseImage;
                });
                this.data = lstdata;
                if(this.data.length > 0){
                  this.handleCourseDetail(this.data[0].courseId);
                }
                this.error = undefined; 

            })
            .catch(error => {
                this.showNotification('Error',error.body.message,'error');
                this.data = null;
            });

    }

    showNotification(title, message, variant) {
      const evt = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
      });
      this.dispatchEvent(evt);
  }

    connectedCallback() {
      this.handleSearchKeyword();
    }
    handleOnTileClick(event){
      this.handleCourseDetail(event.currentTarget.dataset.value);
    }
    handleAdd(event){
      var courseId = event.target.id;
      if(courseId.indexOf('-') > -1){
        courseId = courseId.split('-')[0];
      }
      this.saveAssignmentHandler(courseId);
    }

    saveAssignmentHandler(courseId) {
        
      saveAssignement({
             traineeId: this.recordId,
             courseId: courseId
         })
         .then(result => {
          this.showNotification('Success','Course added successfully!','success');
          this.handleSearchKeyword();
         })
         .catch(error => {
          this.showNotification('Error',error.body.message,'error');
         });

 }
 
	handleCourseDetail(courseId) {
    this.isCoursefound = false;
		getCourse({
			courseId: courseId
		})
		.then(result => {
      let cc = JSON.parse(JSON.stringify(result));
      cc.Image_URL__c = My_Resource+'/'+cc.Image_URL__c;

			this.course = cc;
 
			this.error = undefined; 
      this.isCoursefound = true;
		})
		.catch(error => {
			this.showNotification('Error','unknown error','error');
			this.course = null;
		});

	}
    
}