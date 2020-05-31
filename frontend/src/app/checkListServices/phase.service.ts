import { Injectable } from '@angular/core';
import { WebRequestService } from '../web-request.service';

@Injectable({
  providedIn: 'root'
})
export class PhaseService {

  constructor(private webReqService : WebRequestService) { }

  getPhases(){
    return this.webReqService.get('phases');
  }
  getAllPhases(){
    return this.webReqService.get('PDCA');
  }
  getPhasesById(phaseId){
    return this.webReqService.get(`phases/${phaseId}/`);
  }
}
