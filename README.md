# 前提

これは生成 AI を使用して頑張ってもらっているリポジトリです

# アプリ

- fronted  
  Vercel にデプロイ  
  普段から使ってるから流れで使用  
  環境変数あたりでちょっとてこづった、env.meta...?がどうとか言ってた気がするが

- backend
  Railway にデプロイ  
  無料枠があって PostgreSQL が使えて GitHub のリポジトリと連携できて簡単そうなやつで探した

なんだかんだ動くようにはなったのでヨシ  
見えてるバグは以下

- 書籍の詳細でリロードするとエラーになって、以降エラーになる

## スクショ

トップ画面
![image](https://github.com/user-attachments/assets/f58a8eec-47c4-4f21-8124-294eb2186f8b)
一覧
![image](https://github.com/user-attachments/assets/1c7e3036-8fea-4ffe-9aca-71d2c02803b6)
詳細
![image](https://github.com/user-attachments/assets/d0f4d78c-c3a2-4062-a31e-1df1266c41e8)
編集
![image](https://github.com/user-attachments/assets/112b65d2-16bf-4c75-81e8-6610a32af44f)
新規登録
![image](https://github.com/user-attachments/assets/7481997e-9847-4b6e-94d5-445cee633c02)
登録後
![image](https://github.com/user-attachments/assets/42735480-1d31-4888-9ed4-9cfa84430341)
