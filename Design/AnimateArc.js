<script type="text/javascript">
        function initializearc(){
                var k=20;
                    if(k>=1 && k<=15)
                    {
                        var z= (100/15)*k;
                        var s="polygon(50% 50%,"+String(z)+"% 0% ,"+String(z)+"% 0%,"+String(z)+"% 0%,"+String(z)+"% 0%,0% 0%)";
                        document.getElementById("arcc").style.clipPath=s;
                    }
                    else if(k>15 && k<=30)
                    {
                        var z= (100/15)*(k-15);
                        var s="polygon(50% 50%,100% "+String(z)+"% ,100% "+String(z)+"%,100% "+String(z)+"%,100% 0%,0% 0%)";
                        document.getElementById("arcc").style.clipPath=s;
                    }
                    else if(k>30 && k<=45)
                    {
                        var z= ((100/15)*(k-30));
                        var r=100-z;
                        var s="polygon(50% 50%,"+String(r)+"% 100% ,"+String(r)+"% 100%,100% 100%,100% 0%,0% 0%)";
                        document.getElementById("arcc").style.clipPath=s;
                    }
                    else if( k>45 && k<=60)
                    {
                        var z= ((100/15)*(k-45));
                        var r=100-z;
                        var s="polygon(50% 50%,0% "+String(r)+"% ,0% 100%,100% 100%,100% 0%,0% 0%)";
                        document.getElementById("arcc").style.clipPath=s;
                    }
            }
            initializearc();
    </script>