import { PhaseService } from 'src/app/checkListServices/phase.service';
import { Component, OnInit } from '@angular/core';
import { SubTaskService } from 'src/app/checkListServices/sub-task.service';
import { Sous_tache } from 'src/app/models/sous_tache.model';
import { Chart } from 'chart.js';

@Component({
	selector: 'app-reporting',
	templateUrl: './reporting.component.html',
	styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
	
	phases: any[];
	nbPasMisEnOeuvre: number[] = [];
	nbEnCours: number[] = [];
	nbTermine: number[] = [];
	tasksPieChart = [[]];

	nbAvantLimite: number[] = [];
	nbApresLimite: number[] = [];
	tasksDeliverdOnTimeChart = [[]]; 

	collaboratorsOrderMap: Map<String, number> = new Map<String, number>();
	// collaboratorsOrder: [[]];

	constructor(private phaseService: PhaseService, private subTasksService: SubTaskService) { }
	
	ngOnInit(): void {
		this.phaseService.getPhases().subscribe((phases: any[]) => {
			console.log('Phases = ', phases);
			this.phases = phases;
			
			let i = 0;
			this.phases.forEach((phase) => {
				this.subTasksService.getToDoSubTasksRssi(phase._id).subscribe((todo: Sous_tache[]) => {
					this.nbPasMisEnOeuvre.push(todo.length);

					this.subTasksService.getInProgressSubTasksRssi(phase._id).subscribe((inprogress: Sous_tache[]) => {
						this.nbEnCours.push(inprogress.length);
						
						this.subTasksService.getDoneSubTasksRssi(phase._id).subscribe((done: Sous_tache[]) => {
							this.nbTermine.push(done.length);
							this.updateChart1(i);
							++i;
						}); 
					});
				});
			});

			let j = 0;
			this.phases.forEach((phase) => {
				this.subTasksService.getDoneSubTasksRssi(phase._id).subscribe((done: Sous_tache[]) => {
					this.nbAvantLimite[j] = 0;
					this.nbApresLimite[j] = 0;

					done.forEach((sstache) => {
						console.log('Sous Tache = ', sstache);
						if(this.avantLimite(sstache)) ++this.nbAvantLimite[j];
						else ++this.nbApresLimite[j];
					});

					this.updateChart2(j);
					++j;
				});
			});

			this.phases.forEach((phase) => {
				this.subTasksService.getDoneSubTasksRssi(phase._id).subscribe((done: Sous_tache[]) => {
					done.forEach((sstache) => {
						let collabId = sstache.collaborateur_id;
						if(collabId){
							console.log(collabId);
							--this.collaboratorsOrderMap[collabId];
						}
					});
					console.log(this.collaboratorsOrderMap);

					// this.collaboratorsOrder = [[]];
					// this.collaboratorsOrderMap.forEach((value, key) => {
					// 	// this.collaboratorsOrder.push([String(key), String(value)]);
					// });
				});
			});
		});

    this.tasksDeliverdOnTimeChart = new Chart('pieChart2' , {
      type: 'pie',
      data: {
        labels: ["Tâches Non Terminés avant la date limite ",  "Tâches Terminés avant la date limite "], 
        datasets:[{
          label:'Vote Now', 
          data : [10,15], // 10 : nbr de Taches Non Terminés Avant la date limite , 15 : nbr de Taches  Terminés Avant la date limite
          backgroundColor:[
            '#f44336', 
            '#4CAF50', 
          ],
        }]
      },
      options: {
        title : {
          Text: "Bar Chart ",
          display:true
        }
      }
    }
    );
  
	}

	avantLimite(sstache: Sous_tache): boolean{
		if(sstache.date_fin == '') return false;
		let date_fin = sstache.date_fin.split('-').map(Number);
		let date_reele = sstache.date_reele.split('-').map(Number);
		
		for (let i = 0; i < date_fin.length; i++) {
			if(date_fin[i] < date_reele[i]) return false;
		}
		return true;
	}

	updateChart1(i: number){
		// console.log('1) Phase ', i, ' numbers = ', this.nbPasMisEnOeuvre[i], this.nbEnCours[i], this.nbTermine[i]);
		
		this.tasksPieChart.push(new Chart('pieChart1_' + i.toString() , {
			type: 'pie',
			data: {
				labels: ["Pas mis en oeuvre", "En Cours", "Terminé "], 
				datasets:[{
					label:'Vote Now', 
					data : [this.nbPasMisEnOeuvre[i], this.nbEnCours[i], this.nbTermine[i]], 
					backgroundColor:[
						'#f44336', 
						'#2BA8FF', 
						'#4CAF50', 
					],
				}]
			},
			options: {
				title : {
					Text: "Bar Chart ",
					display:true
				}
			}
		}));
	}

	updateChart2(i: number){
		console.log('2) Phase ', i, ' numbers = ', this.nbAvantLimite[i], this.nbApresLimite[i]);

		this.tasksDeliverdOnTimeChart.push(new Chart('pieChart2_' + i.toString() , {
			type: 'pie',
			data: {
				labels: ["Tâches Non Terminés Avant la date limite ",  "Tâches Terminés Aprés la date limite "], 
				datasets:[{
					label:'Vote Now', 
					data : [this.nbAvantLimite[i], this.nbApresLimite[i]], // 10 : nbr de Taches Non Terminés Avant la date limite , 15 : nbr de Taches  Terminés Avant la date limite
					backgroundColor:[
						'#4CAF50', 
						'#f44336', 
					],
				}]
			},
			options: {
				title : {
					Text: "Bar Chart ",
					display:true
				}
			}
		}));
	}
	
}
