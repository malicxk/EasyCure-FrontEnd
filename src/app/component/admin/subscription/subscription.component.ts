import { Component } from '@angular/core';
import { Subscription } from '../../../model/auth';
import { AdminService } from '../../../service/admin.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  visible: boolean = false;
  subscriptions: Subscription[] = [];
  newSubscription: Subscription = {
    _id: '',
    plan: '',
    price: 0,
    features: [],
    active: true,
    startDate: new Date(),
    endDate: undefined,
    userId: ''
  };

  constructor(
    private adminService: AdminService,
  ) { }

  showDialog(): void {
    this.visible = true;
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.adminService.getAllSubscriptions().subscribe(
      (subscriptions: Subscription[]) => {
        this.subscriptions = subscriptions;
      },
      (error) => {
        console.error('Error loading subscriptions:', error);
        // Handle error loading subscriptions
      }
    );
  }

  // saveSubscription(): void {
  //   this.adminService.createSubscription(this.newSubscription).subscribe(
  //     (response) => {
  //       console.log('Subscription added successfully:', response);
  //       this.visible = false;
  //       // Optionally, reset newSubscription object or perform other actions
  //       this.newSubscription = {
  //         plan: '',
  //         features:'',
  //         price: 0,
  //         active: true,
  //         startDate: new Date(),
  //         endDate: undefined
  //       };
  //     },
  //     (error) => {
  //       console.error('Error adding subscription:', error);
  //       // Handle error as needed
  //     }
  //   );
  // }


}
