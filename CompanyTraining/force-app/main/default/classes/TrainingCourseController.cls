public class TrainingCourseController{
    
    
    @AuraEnabled(cacheable = true)
    public static list<TraineeCourse> findCourses(String traineeId, String position, String level){
        List<TraineeCourse> traineeCourses = new List<TraineeCourse>();
        Set<Id> assignedCourses = new Set<Id>();
        
        for(Course_Assignment__c c: [SELECT Course__c from Course_Assignment__c where Trainee__c =: traineeId]){
            assignedCourses.add(c.Course__c);
        }
        String query = 'SELECT Id, Name, Title__c,Description__c, Image_URL__c, Level__c,Position__c FROM Course__c where Name != null ';
        if(position != 'All'){
            query += ' and Position__c =: position ';
        }
        if(level != 'All'){
            query += ' and Level__c =: level ';
        }
        list<Course__c> myrecords = Database.query(query);
        for(Course__c c: myrecords){
            system.debug('###:'+traineeId+'::'+assignedCourses+'::'+assignedCourses.contains(c.Id));
            Boolean isAssigned = assignedCourses.contains(c.Id);
            TraineeCourse tc = new TraineeCourse(c.Id,c.Name,c.Title__c,c.Description__c, isAssigned, c.Image_URL__c);
            traineeCourses.add(tc);
        }
        return traineeCourses;
    }
    
    @AuraEnabled(cacheable = true)
    public static Course__c getCourse(String courseId){
        system.debug('@@@:'+courseId +'::'+[SELECT Id, Name, Title__c,Description__c, Image_URL__c, Level__c,Position__c FROM Course__c where Id =: courseId limit 1]);
        return [SELECT Id, Name, Title__c,Description__c, Image_URL__c, Level__c,Position__c FROM Course__c where Id =: courseId limit 1];
    }    
    
    @AuraEnabled(Cacheable=false)
    public static void saveAssignement(String traineeId, String courseId){
        Course_Assignment__c assignment = new Course_Assignment__c(Trainee__c = traineeId, Course__c = courseId);
        insert assignment;
    }
    
    public class TraineeCourse{
        
        @AuraEnabled public String courseId{get;set;}
        @AuraEnabled public String courseName{get;set;}
        @AuraEnabled public String courseTitle{get;set;}
        @AuraEnabled public String courseDescription{get;set;}
        @AuraEnabled public Boolean isAssigned{get;set;}
        @AuraEnabled public String courseImage{get;set;}
        
        public TraineeCourse(String courseId, String courseName, String courseTitle, String courseDescription, Boolean isAssigned, String courseImage){
            this.courseId = courseId;
            this.courseName = courseName;
            this.courseTitle = courseTitle;
            this.courseDescription = courseDescription;
            this.isAssigned= isAssigned;
            this.courseImage= courseImage;
        }
        
    }
}