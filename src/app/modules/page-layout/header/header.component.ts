import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public user$ = this.auth.user$;

  constructor(
    public auth : AuthService
  ) { }

  ngOnInit(): void {
    // Set a variable in sessionStorage for showing or hiding import buttons
    this.auth.user$
      .subscribe(user => {
        if (user.import) {
          sessionStorage.setItem("import", "true");
        } else {
          sessionStorage.setItem("import", "false");
        }
      })
  }

}
