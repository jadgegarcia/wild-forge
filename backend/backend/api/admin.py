from django.contrib import admin
from .models import Activity,ActivityComment,ActivityCriteria,ActivityGeminiSettings,ActivityCriteriaRelation,ActivityTemplate,ActivityWorkAttachment,Chatbot,ClassMember,ClassRoom,ClassRoomPE,ClassRoomPETaker,Criteria,Feedback,Meeting,MeetingComment,MeetingCriteria,MeetingPresentor,Message,PeerEval,Pitch,Rating,Remark,SpringBoardTemplate,SpringProject,SpringProjectBoard,Team,TeamMember,User,MeetingPresentor
# Register your models here.

admin.site.register(Activity)
admin.site.register(ActivityComment)
admin.site.register(ActivityCriteria)
admin.site.register(ActivityCriteriaRelation)
admin.site.register(ActivityGeminiSettings)
admin.site.register(ActivityTemplate)
admin.site.register(ActivityWorkAttachment)
admin.site.register(Chatbot)
admin.site.register(ClassMember)
admin.site.register(ClassRoom)
admin.site.register(ClassRoomPE)
admin.site.register(ClassRoomPETaker)
admin.site.register(Criteria)
admin.site.register(Feedback)
admin.site.register(Meeting)
admin.site.register(MeetingComment)
admin.site.register(MeetingCriteria)
admin.site.register(MeetingPresentor)
admin.site.register(Message)
admin.site.register(PeerEval)
admin.site.register(Pitch)
admin.site.register(Rating)
admin.site.register(Remark)
admin.site.register(SpringBoardTemplate)
admin.site.register(SpringProject)
admin.site.register(SpringProjectBoard)
admin.site.register(Team)
admin.site.register(TeamMember)
admin.site.register(User)