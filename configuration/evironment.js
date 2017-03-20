process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if(process.ev.NODE_ENV === 'development'){
  require('dotenv').config()
}
