import { Injectable } from '@angular/core';
import { WebRequestService } from '../web-request.service';
@Injectable({
	providedIn: 'root'
})
export class SubTaskService {
	
	constructor(private webReqService : WebRequestService) { }
	
	getToDoSubTasks(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/pas_mis_en_oeuvre`);
	}
	getInProgressSubTasks(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/en_cours`);
	}
	getDoneSubTasks(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/termine`);
	}

	getToDoSubTasksRssi(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/pas_mis_en_oeuvre/rssi`);
	}
	getInProgressSubTasksRssi(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/en_cours/rssi`);
	}
	getDoneSubTasksRssi(phaseId : string){
		return this.webReqService.get(`sousTaches/${phaseId}/termine/rssi`);
	}

	getSousTacheByTacheId(tacheId){
		return this.webReqService.get(`sousTaches/tache/${tacheId}/`);
	}

	getSousTacheById(sstacheId){
		return this.webReqService.get(`sousTaches/${sstacheId}/`);
	}

	getExigenceById(exigenceId){
		return this.webReqService.get(`sousTaches/exigence/${exigenceId}/`);
	}
	
	getCollaborateurById(collaborateurId){
		return this.webReqService.get(`sousTaches/collaborateur/${collaborateurId}/`);
	} 
	
	getPhaseById(phaseId){
		return this.webReqService.get(`sousTaches/phases/${phaseId}/`);
		
	}
	updateSubTaskStatus(subTaskId : string , status : string){
		return this.webReqService.updateSubTaskStatus(subTaskId,status);
		
	}
	
	
}
