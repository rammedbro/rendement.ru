echo -e "\n### Script starting ###"
cd $1
echo -e "\n\n### Getting changes from repo ###"
git pull
echo -e "\n### Installing packages ###"
npm install
echo -e "\n### Restarting application ###"
pm2 restart $2
echo -e "\n### Script finished ###"