import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { AuthRssiService } from 'src/app/auth-rssi.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

	constructor(private http : HttpClient, private webService:WebRequestService) { }

	createWorkspace(nom: string){
		let rssiId = this.getCurrentRssiId();
		return this.webService.createWorkspace(nom,rssiId).pipe(
			tap((res: any) => {
				this.setWorkSpaceSession(res._id);
				console.log("Workspace created!");
			})
		)
	}

	getWorkSpaceByid(id :string){   
         return this.webService.getWorkSpaceById(id);
	}

    setWorkSpaceSession(workspaceId: string) {
		localStorage.setItem('workspace-id', workspaceId);		
	  }

	private getCurrentRssiId(){
		return localStorage.getItem('rssi-id');
	}
	removeWorkspaceSession(){

		localStorage.removeItem('workspace-id');
	}

    


}