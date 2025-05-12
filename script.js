new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    tab: 0, // タブの初期値
    Name: '',
    PhoneNumber: '',
    MailAddress: '',
    Number_of_Tickets: '',
    SeatType: '',
    UpdateId: '',
    dataList: [],
    reservationMessage: '',
    // チケット枚数の選択肢
    ticketOptions: [
      { text: '1枚', value: '1' },
      { text: '2枚', value: '2' },
      { text: '3枚', value: '3' },
      { text: '4枚', value: '4' },
    ],
    // 席種番号の選択肢
    seatOptions: [
      { text: 'アリーナ席', value: 'アリーナ席' },
      { text: 'スタンド席', value: 'スタンド席' },
    ]

  },
  methods: {
    formatPhoneNumber() {
      // ハイフンや全角文字を削除し、半角数字のみを残す
      this.PhoneNumber = this.PhoneNumber.replace(/[^0-9]/g, '');
    },
    phoneNumberRules(value) {
      // 空の入力に対するエラーメッセージ
      if (!value) return '電話番号を入力してください';
      // 半角数字のみのチェック
      const regex = /^[0-9]+$/;
      if (!regex.test(value)) return '半角数字のみで入力してください';
      return true; // 検証通過
    },

    addData: async function() {
      
      //POSTメソッドで送るパラメーターを作成
      const param = {
        Name : this.Name,
        PhoneNumber : this.PhoneNumber,
        MailAddress : this.MailAddress,
        Number_of_Tickets: this.Number_of_Tickets,
        SeatType: this.SeatType,
      };
      
      try {
    const response = await axios.post('https://m3h-ito-tempbackapp.azurewebsites.net/api/INSERT', param);
    console.log('API Response:', response.data); // APIレスポンスの内容を確認

    // ここでAPIのレスポンス内容に基づいてメッセージを設定
    this.reservationMessage ='Your reservation is complete. Thank you for booking with us!';
  } catch (error) {
    console.error('Error reserving tickets:', error);
    this.reservationMessage = 'Failed to reserve tickets. Please try again.';
  }

    },
      
    // データベースからデータを取得する関数
    readData: async function() {
      // 電話番号が入力されている場合のみAPIを呼び出す
      if (this.PhoneNumber) {
     try {
      //SELECT用のAPIを呼び出し、電話番号をパラメータとして渡す      
      const response = await axios.get('https://m3h-ito-tempbackapp.azurewebsites.net/api/SELECT',{
            params: {
              PhoneNumber: this.PhoneNumber
            }
          });
      
      //結果リストを表示用配列に代入
      this.dataList = response.data.List;
    } catch (error) {
          console.error('Error reading data:', error);
        }
      } else {
        alert('予約時の電話番号を入力してください');
     }
   },

    
    // データベースのデータを更新する関数
    async updateData() {
      const param = {
        Id: this.UpdateId,
        Name: this.Name,
        PhoneNumber: this.PhoneNumber,
        MailAddress: this.MailAddress,
        Number_of_Tickets: this.Number_of_Tickets,
        SeatType: this.SeatType,
      };
      try {
        const response = await axios.put('https://m3h-ito-tempbackapp.azurewebsites.net/api/UPDATE', param);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    },
    
    // 予約データの削除
  async deleteData() {
     if (this.PhoneNumber) {

    // 確認ダイアログの表示
    const confirmCancel = confirm("予約をキャンセルしますか？");
    
    // ユーザーが確認した場合のみ削除処理を実行
    if (confirmCancel) {
     try {
          const response = await axios.post('https://m3h-ito-tempbackapp.azurewebsites.net/api/DELETE', {
              PhoneNumber: this.PhoneNumber
          });
          console.log('API Response:', response.data);
          alert('予約がキャンセルされました');
          this.readData(); // データ再取得で画面更新
        } catch (error) {
          console.error('Error deleting data:', error);
          alert('予約のキャンセルに失敗しました。もう一度やり直してください。');

     
      }
    }
  
  }else {
        alert('Please enter a phone number to cancel the reservation.');
  }
  }
  },
    
});