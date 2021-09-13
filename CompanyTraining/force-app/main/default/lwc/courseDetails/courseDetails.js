import { LightningElement, wire} from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COURSE_DETAIL_CHANNEL from '@salesforce/messageChannel/course_detail__c';

export default class CourseDetails extends LightningElement {

    @wire(MessageContext)
    messageContext;
    Name;
    Description;
    CourseImage;
    Level;
    Position;
    Title;
    Link;
    Category;

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        console.log('subscriber is called');
        this.subscription = subscribe(
            this.messageContext,
            COURSE_DETAIL_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    // Handler for message received by component
    handleMessage(message) {

        this.Name=message.Name;
        this.Description=message.Description;
        this.CourseImage=message.CourseImage;
        this.Level=message.Level;
        this.Position=message.Position;
        this.Title=message.Title;
        this.Link=message.Link;
        this.Category=message.Category;
        console.log('retrieved data from message payload');
    
    }

    connectedCallback() {
        console.log('Calling subscriber');
        this.subscribeToMessageChannel();
    }
}