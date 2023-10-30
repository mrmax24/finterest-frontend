import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { AuthService } from '../auth.service';
import {environment} from "../../../environment";


interface UserInfoDto {
  userName: string;
  currentBalance: string;
  userAccounts: AccountDto[];
  categories: TransactionCategoryDto[];
}

interface AccountDto {
  id: number;
  name: string;
  balance: string;
}

interface TransactionCategoryDto {
  id: number;
  categoryName: string;
}

interface TransactionRequestDto {
  id: number,
  accountId: number;
  categoryId: number;
  amount: string;
  currency: string;
  note: string;
  date: string;
}

interface TransactionsListDto {
  transactionId : number
  date: string;
  account: string;
  categoryName: string;
  note: string;
  amount: number;
}
interface AccountRequestDto {
  name: string;
  balance: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  isPopupOpen: boolean = false;
  editingTransactionId: number = 0;
  showAllRows: boolean = false;
  showAllTransactions: boolean = false;
  openLogOutPopup: boolean = false;
  openAddAccountPopup: boolean = false;
  isDropdownOpen = false;
  displayedTransactionIds: number[] = [];
  selectedOption: string | undefined;
  @Input() options: string[] = [];

  userInfo: UserInfoDto = {
    userName: '',
    currentBalance: '',
    userAccounts: [],
    categories: []
  };

  categories: TransactionCategoryDto[] = [];
  transactions: TransactionsListDto[] = [];


  transactionRequestDto: TransactionRequestDto = {
    id: 0,
    accountId: 0,
    categoryId: 0,
    amount: '',
    currency: '',
    note: '',
    date: ''
}

  accountRequestDto: AccountRequestDto = {
    name: "",
    balance: ""
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getTransactions();
    const headers = this.authService.getAuthorizationHeader();
    const serverUrl = environment.serverUrl;

    this.http.get<UserInfoDto>(`${serverUrl}`, { headers }).subscribe(response => {
        if (response) {
          this.userInfo.userName = response.userName;
          this.userInfo.currentBalance = response.currentBalance;
          this.userInfo.userAccounts = response.userAccounts;
          this.userInfo.categories = response.categories;
          this.cdr.detectChanges();
        } else {
          console.error('Response is undefined');
        }
      });
  }

  getCategories() {
    const headers = this.authService.getAuthorizationHeader();
    const serverUrl = environment.serverUrl;
    this.http.get<TransactionCategoryDto[]>(`${serverUrl}/categories`, {headers})
      .subscribe(data => {
      this.categories = data;
      console.log(data)
    });
  }

  addTransaction() {
    const transactionsData: TransactionRequestDto = {
      id: this.editingTransactionId,
      accountId: +this.transactionRequestDto.accountId,
      categoryId: +this.transactionRequestDto.categoryId,
      amount: this.transactionRequestDto.amount,
      currency: this.transactionRequestDto.currency,
      note: this.transactionRequestDto.note,
      date: this.transactionRequestDto.date
    };

    console.log('transactionsData:', transactionsData);

    const headers = this.authService.getAuthorizationHeader('application/json');
    const body = JSON.stringify(transactionsData);
    const serverUrl = environment.serverUrl;
    this.http.post<any>(`${serverUrl}/add-transaction`, body, { headers })
      .subscribe(
        (response) => {
          console.log('POST request successful:', response);
          this.getTransactions();
        },
        error => {
          console.error('POST request error:', error);
          if (error instanceof HttpErrorResponse) {
          }
        });
  }

  editTransaction() {
    const transactionsData: TransactionRequestDto = {
      id: this.editingTransactionId,
      accountId: +this.transactionRequestDto.accountId,
      categoryId: +this.transactionRequestDto.categoryId,
      amount: this.transactionRequestDto.amount,
      currency: this.transactionRequestDto.currency,
      note: this.transactionRequestDto.note,
      date: this.transactionRequestDto.date
    };

    console.log('transactionsData:', transactionsData);

    const headers = this.authService.getAuthorizationHeader('application/json');
    const body = JSON.stringify(transactionsData);
    const serverUrl = environment.serverUrl;
    this.http.post<any>(`${serverUrl}/edit-transaction`, body, { headers })
      .subscribe(
        (response) => {
          console.log('PUT request successful:', response);
          this.getTransactions();
          this.isPopupOpen = false;
        },
        (error) => {
          console.error('PUT request error:', error);
          if (error instanceof HttpErrorResponse) {
            // Обробка помилок
          }
        });
  }

  deleteTransaction() {
    const id = this.editingTransactionId;
    const headers = this.authService.getAuthorizationHeader('application/json');
    const serverUrl = environment.serverUrl;
    this.http.post<any>(`${serverUrl}/delete-transaction/${id}`, null, { headers })
      .subscribe(
        (response) => {
          console.log('DELETE request successful:', response);
          this.getTransactions();
          this.isPopupOpen = false;
        },
        (error) => {
          console.error('DELETE request error:', error);
        });
  }

    getTransactions() {
      const headers = this.authService.getAuthorizationHeader();
      const serverUrl = environment.serverUrl;
      this.http.get<TransactionsListDto[]>(`${serverUrl}/transactions`, {headers})
        .subscribe(data => {
          this.transactions = data;
          console.log(data)
        });
    }

    createAccount() {
    const accountData: AccountRequestDto = {
      name: this.accountRequestDto.name,
      balance: this.accountRequestDto.balance
    }
      const serverUrl = environment.serverUrl;
      const headers = this.authService.getAuthorizationHeader();
      const body = JSON.stringify(accountData);
      this.http.post<any>(`${serverUrl}/create-account`, body, {headers})
        .subscribe(response => {
        console.log('POST request successful:', response);
        console.log(body);
        this.getAccounts();
        this.openAddAccountPopup = false;
      },
      (error) => {
        console.error('POST request error:', error);
      });
    }

  getAccounts() {
    const serverUrl = environment.serverUrl;
    const headers = this.authService.getAuthorizationHeader();
    this.http.get<AccountDto[]>(`${serverUrl}/accounts`, {headers})
      .subscribe(data => {
        this.userInfo.userAccounts = data;
        console.log(data);
      });
  }

  openPopup(transactionId : number) {
    this.isPopupOpen = true;
    this.editingTransactionId = transactionId;
    console.log('Popup should open');
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  showAll() {
    this.displayedTransactionIds = this.transactions.map(transaction => transaction.transactionId);
    this.showAllTransactions = true;
  }

  closeAll() {
    this.showAllTransactions = false;
  }

  showLogOutPopup() {
    this.openLogOutPopup = true;
  }

  hideLogOutPopup() {
    this.openLogOutPopup = false;
  }

  showAddAccountPopup() {
    this.openAddAccountPopup = true;
  }

  hideAddAccountPopup() {
    this.openAddAccountPopup = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  protected readonly undefined = undefined;
}
