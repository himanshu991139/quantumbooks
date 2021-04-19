import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn=false;
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.auth.user.subscribe((res)=>{
      this.isLoggedIn=!!res
    })
  }
  signOut()
  {
    this.auth.signOut();
  }
}
