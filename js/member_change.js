$(function(){

	//请求所有成员信息
	$.ajax({
		url : "http://rapapi.org/mockjsdata/22944/memberMessageAction!findAllInOneTeam.action",
		type : "POST",
		data : {
			userUnique:1
		},
		success : function(data){
			if (data.code == 1) {
				var memberData = data.memberMessages;
				var memberStr = '';
				var len = memberData.length;
				for(var i=0;i<len;i++){
					memberStr += '<tr>'+
					  				'<td class="memberStuId">'+ memberData[i].memberStuId +'</td>'+
					  				'<td class="memberName">'+ memberData[i].memberName +'</td>'+
					  				'<td class="memberRole">'+ memberData[i].memberRole +'</td>'+
					  				'<td class="memberScore">'+ memberData[i].memberScore +'</td>'+
					  				'<td><span class="memberChange">修改</span><span class="memberDel">删除</span></td>'+
					  			'</tr>'
				}
				$(".memberInfo-table").append(memberStr);

				//点击修改
				$(".memberChange").click(function(){
					//弹出修改表单
					var changeBoxStr = '';
					changeBoxStr = '<div class="addBox-all">'+
										'<div class="addBox-title">企业内部职务设置<span class="addBox-close">X</span></div>'+
								  		'<div class="addBox-content">'+
									  		'<form id="changeForm" name="changeForm" method="post" enctype="multipart/form-data">'+
									  			'<p>'+
									  				'学&nbsp;&nbsp;&nbsp;&nbsp;号：<input name="memberStuId" type="text" value="'+ $(this).parent().siblings().eq(0).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'姓&nbsp;&nbsp;&nbsp;&nbsp;名：<input name="memberName" type="text" value="'+ $(this).parent().siblings().eq(1).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'职&nbsp;&nbsp;&nbsp;&nbsp;务：<input name="memberRole" type="text" value="'+ $(this).parent().siblings().eq(2).text() +'" />'+
									  			'</p>'+
									  			'<p>'+
									  				'贡献率：<input name="memberScore" type="text" value="'+ $(this).parent().siblings().eq(3).text() +'" />'+
									  			'</p>'+
									  		'</form>'+
									  		'<p>'+
								  				'<button class="changeMember-sure">修改</button>'+
								  			'</p>'+
								  		'</div>'+
								  	'</div>';
					//添加弹出框
					$(".addBox").html(changeBoxStr)
					//点击X
					$(".addBox-close").click(function(){
						$(".addBox-all").remove();
					})

					//点击确认修改
					$(".changeMember-sure").click(function(){
						var changeform = new FormData(document.getElementById("changeForm"));
						console.log($("#changeForm").serialize());
						$.ajax({
							url : "/memberMessageAction!updateMemberMessage.action",
							type : "POST",
							processData: false,
							data :changeform,
							success : function(data){   //请求成功
								if(data.code == 1){
									console.log(data);  //打印出后台返回数据
									alert(data.result); 
									window.location.reload();  //页面自动重新加载
								}				
							},
							error : function(){   //请求失败
								alert("请求失败");
							}
						})
					}) //点击确认修改结束
				})  //点击修改结束
				 

				//点击删除
				$(".memberDel").click(function(){
					var memberName = $(this).parent().siblings().eq(1).text(); //获取成员姓名
					console.log(memberName);
					if (confirm("确认删除此成员？")) {
						$.ajax({
							url : "/memberMessageAction!deleteMemberMessage.action",
							type : "POST",
							data : {
								memberName : memberName,
								userUnique : memberData.userUnique
							},
							success : function(data){
								if (data.code == 1) {
									alert(data.result);
									window.location.reload();  //页面自动重新加载	
								}
							},
							error : function(){
								alert("请求失败");
							}
						}) //删除ajax结束
					} //点击弹出窗口结束 
				}) //点击删除结束
			}
		},
		error : function(){
			alert("请求失败");
		}
	})

	//点击添加按钮
	$(".addMember").click(function(){
		//弹出弹出框
		var addBoxStr = '';
		addBoxStr = '<div class="addBox-all">'+
						'<div class="addBox-title">企业内部职务设置<span class="addBox-close">X</span></div>'+
				  		'<div class="addBox-content">'+
					  		'<form id="memberForm" name="memberForm" method="post" enctype="multipart/form-data">'+
					  			'<p>'+
					  				'学&nbsp;&nbsp;&nbsp;&nbsp;号：<input name="memberStuId" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'姓&nbsp;&nbsp;&nbsp;&nbsp;名：<input name="memberName" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'职&nbsp;&nbsp;&nbsp;&nbsp;务：<input name="memberRole" type="text" />'+
					  			'</p>'+
					  			'<p>'+
					  				'贡献率：<input name="memberScore" type="text" />'+
					  			'</p>'+
					  		'</form>'+
					  		'<p>'+
				  				'<button class="addMember-sure">添加</button>'+
				  			'</p>'+
				  		'</div>'+
				  	'</div>';
		//添加弹出框
		$(".addBox").html(addBoxStr)

		//点击X
		$(".addBox-close").click(function(){
			$(".addBox-all").remove();
		})

		//确认添加
		$(".addMember-sure").click(function(){
			var form = new FormData(document.getElementById('memberForm'));
			console.log($("#memberForm").serialize());
			$.ajax({
				url : "/memberMessageAction!addMemberMessage.action",
				type : "POST",
				processData: false,
				data :form,
				success : function(data){   //请求成功
					console.log(data);  //打印出后台返回数据
					alert(data.result); 
					window.location.reload();  //页面自动重新加载					
				},
				error : function(){   //请求失败
					alert("请求失败");
				}
			})
		})
	})
	//点击删除
})